const mongodb = require('../mongodb.js')
const reddit = require('../reddit_api/reddit.js')

class RedditAuth {
  constructor () {

  }

  async request (query) {
    if (query.error) return {error: query.error}
    let redditAuthCode = query.code || ''
    let accessToken = await reddit.authorizationCodeToAccessToken(redditAuthCode)

    let redditUser = await reddit.accessTokenToUser(accessToken)
    let redditSubs = await reddit.accessTokenToSubscriptions(accessToken)
    //
    let userData = {redditUser, redditSubs}
    let UID = await this.getUID(userData) // also creates new user if none exists
    let sessionToken = await this.createSession(accessToken, UID)
    await this.saveRawUserData(userData)
    await this.updateUserSubscriptions(userData)

    return {token: sessionToken}
  }

  async getUID (userData) {
    let db = await mongodb.db('MeetReddit')
    let response = await db.collection('User').findOne({RedditId: userData.redditUser.id}, {projection: {_id: 0, UID: 1}})
    if (response === null) return await this.getUID(await this.createNewUser(userData))
    else return response.UID
  }

  async createNewUser (userData) {
    let db = await mongodb.db('MeetReddit')
    let user = {
      UID: await this.generateUID(),
      RedditId: userData.redditUser.id,
      RedditUsername: userData.redditUser.name,
      PreferedName: '',
      Gender: '',
      MainPicture: {
        URl: {
          Small: '',
          Medium: '',
          Large: '',
          Original: ''
        },
        RIID: ''
      },
      Settings: {
        ShowRedditUsername: true,
        ShowUserRedditImages: true,
        ActivateProfile: false
      },
      Location: {
        Lat: 0,
        Lon: 0
      },
      RedditSubscriptions: [],
      UserRedditImages: [],
      ActiveChatRooms: {},
      UserIsReadingChat: false
    }

    await db.collection('User').createIndex('UID', {unique: true, name: 'UID'})
    await db.collection('User').createIndex('RedditId', {unique: true, name: 'RedditId'})
    await db.collection('User').createIndex('Location', {name: 'Location'})
    await db.collection('User').insertOne(user)

    return userData
  }

  async saveRawUserData (userData) {
    let db = await mongodb.db('MeetReddit')
    await db.collection('RedditUserDump').createIndex('id', {unique: true, name: 'id'})
    await db.collection('RedditUserDump').updateOne({id: userData.redditUser.id}, {$set: userData.redditUser}, {upsert: true})
    return userData
  }

  async updateUserSubscriptions (userData) {
    let db = await mongodb.db('MeetReddit')
    let response = await db.collection('User').findOne({RedditId: userData.redditUser.id}, {projection: {_id: 0, RedditSubscriptions: 1}})
    if (response === null) throw 'Unable to update user subscriptions!'

    // Transfer hide status over from the old subscriptions
    let subs = response.RedditSubscriptions
    let newSubs = userData.redditSubs.reduce((a, v) => {v.hide = false; a[v.id] = v; return a}, {})
    Object.keys(subs).forEach(key => {
      if (subs[key].hide && typeof newSubs[key] !== 'undefined') newSubs[key].hide = true
    })
    await db.collection('User').updateOne({RedditId: userData.redditUser.id}, {$set: {RedditSubscriptions: newSubs}})
    return userData
  }

  async createSession (accessToken, UID) {
    let db = await mongodb.db('MeetReddit')
    let SID = this.generateSID()
    let session = {
      SID,
      UID,
      Valid: true,
      Created: Date.now(),
      LastAccess: Date.now(),
      RedditAccessToken: accessToken
    }
    await db.collection('Sessions').createIndex('SID', {unique: true, name: 'SID'})
    await db.collection('Sessions').createIndex('UID', {name: 'UID'})
    await db.collection('Sessions').insertOne(session)
    return session.SID
  }

  generateSID () {
    return this.makeid('S-', 38)
  }

  async generateUID () {
    let UID = this.makeid('U-', 8)
    if (await this.isUniqueUID(UID)) return UID
    else return await this.generateUID()
  }

  async isUniqueUID (UID) {
    let db = await mongodb.db('MeetReddit')
    let response = await db.collection('User').findOne({UID}, {projection: {_id: 0, UID: 1}})
    return response === null
  }

  makeid(prefix, length) {
    let id = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-0123456789'

    for (var i = 0; i < length; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return prefix + id
  }
}

module.exports = new RedditAuth()
