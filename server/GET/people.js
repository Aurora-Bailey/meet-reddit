const mongodb = require('../mongodb.js')
const lib = require('../lib.js')

class People {
  constructor () {

  }

  async request (req) {
    let db = await mongodb.db('meet_reddit')
    let headers = req.headers
    let query = req.query
    let params = req.params
    let body = req.body

    // Session
    if (!headers.authorization || headers.authorization.split(' ').length < 2)
      return {error: 'Auth not found!'}
    let SID = headers.authorization.split(' ')[1]
    let session = await lib.fetchSession(SID)
    if (session === null) return {error: 'Invalid auth!'}

    // Search settings
    let limit = parseInt(query.limit) || 20
    if (limit > 100) limit = 100
    let skip = parseInt(query.skip) || 0
    let distance = parseInt(query.distance) || 50000 // meters
    let filter = query.filter || false

    let userData = await db.collection('users').findOne({UID: session.UID}, {projection: {_id: 0, location: 1, reddit_subscriptions: 1}})
    let userSubs = Object.keys(userData.reddit_subscriptions)
    let location = {
      $near: {
        $geometry: userData.location,
        $minDistance: 0, // in meters (not kilometers)
        $maxDistance: distance
      }
    }
    let projection = {
      _id: 0,
      UID: 1,
      reddit_username: 1,
      prefered_name: 1,
      gender: 1,
      main_picture: 1,
      settings: 1,
      location: 1,
      reddit_subscriptions: 1
    }

    // run query
    let search = {location} // remove self , UID: {$ne: session.UID}
    if (filter !== false && userSubs.includes(filter)) search['reddit_subscriptions' + '.' + filter] = {$exists: true}
    let options = {projection, limit, skip}
    let results = await db.collection('users').find(search, options).toArray()

    // filter out sensitive data
    let [lon1, lat1] = userData.location.coordinates
    results.map(person => {
      let [lon2, lat2] = person.location.coordinates
      person.distance = lib.distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2)

      if (!person.settings.show_reddit_username) person.reddit_username = false

      Object.keys(person.reddit_subscriptions).forEach(sub => {
        if (!userSubs.includes(sub) || person.reddit_subscriptions[sub].hide) delete person.reddit_subscriptions[sub]
      })

      delete person.settings
      delete person.location
    })

    return {test: results}
  }
}

module.exports = new People()
