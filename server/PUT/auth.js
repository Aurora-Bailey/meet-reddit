const mongodb = require('../mongodb.js')
const reddit = require('../reddit_api/reddit.js')

class Auth {
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
    let db = await mongodb.db('meet_reddit')
    let response = await db.collection('users').findOne({reddit_id: userData.redditUser.id}, {projection: {_id: 0, UID: 1}})
    if (response === null) return await this.getUID(await this.createNewUser(userData))
    else return response.UID
  }

  async createNewUser (userData) {
    let db = await mongodb.db('meet_reddit')
    let user = {
      UID: await this.generateUID(),
      reddit_id: userData.redditUser.id,
      reddit_username: userData.redditUser.name,
      prefered_name: '',
      gender: '',
      main_picture: {
        url: {
          small: '',
          medium: '',
          large: '',
          original: ''
        },
        RIID: ''
      },
      settings: {
        show_reddit_username: true,
        show_user_reddit_images: true,
        activate_profile: false
      },
      location: {
        type: 'Point',
        coordinates: [0, 0]
      },
      reddit_subscriptions: [],
      reddit_user_images: [],
      active_chatrooms: {},
      user_is_reading_chat: false
    }

    await db.collection('users').createIndex('UID', {unique: true, name: 'UID'})
    await db.collection('users').createIndex('reddit_id', {unique: true, name: 'reddit_id'})
    await db.collection('users').createIndex({location: '2dsphere'})
    await db.collection('users').insertOne(user)

    return userData
  }

  async saveRawUserData (userData) {
    let db = await mongodb.db('meet_reddit')
    await db.collection('reddit_user_dump').createIndex('id', {unique: true, name: 'id'})
    await db.collection('reddit_user_dump').updateOne({id: userData.redditUser.id}, {$set: userData.redditUser}, {upsert: true})
    return userData
  }

  async updateUserSubscriptions (userData) {
    let db = await mongodb.db('meet_reddit')
    let response = await db.collection('users').findOne({reddit_id: userData.redditUser.id}, {projection: {_id: 0, reddit_subscriptions: 1}})
    if (response === null) throw 'Unable to update user subscriptions!'

    // Transfer hide status over from the old subscriptions
    let subs = response.reddit_subscriptions
    let newSubs = userData.redditSubs.reduce((a, v) => {v.hide = false; a[v.id] = v; return a}, {})
    Object.keys(subs).forEach(key => {
      if (subs[key].hide && typeof newSubs[key] !== 'undefined') newSubs[key].hide = true
    })
    await db.collection('users').updateOne({reddit_id: userData.redditUser.id}, {$set: {reddit_subscriptions: newSubs}})
    return userData
  }

  async createSession (accessToken, UID) {
    let db = await mongodb.db('meet_reddit')
    let SID = this.generateSID()
    let session = {
      SID,
      UID,
      valid: true,
      created: Date.now(),
      last_access: Date.now(),
      reddit_access_token: accessToken
    }
    await db.collection('sessions').createIndex('SID', {unique: true, name: 'SID'})
    await db.collection('sessions').createIndex('UID', {name: 'UID'})
    await db.collection('sessions').insertOne(session)
    return session.SID
  }

  generateSID () {
    return this.makeid(40)
  }

  async generateUID () {
    let UID = this.makeid(10)
    if (await this.isUniqueUID(UID)) return UID
    else return await this.generateUID()
  }

  async isUniqueUID (UID) {
    let db = await mongodb.db('meet_reddit')
    let response = await db.collection('users').findOne({UID}, {projection: {_id: 0, UID: 1}})
    return response === null
  }

  makeid(length) {
    let id = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-0123456789'

    for (var i = 0; i < length; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return id
  }
}

module.exports = new Auth()
