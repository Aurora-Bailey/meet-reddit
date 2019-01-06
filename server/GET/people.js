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
    if (limit > 100 || limit < 1) limit = 100
    let skip = parseInt(query.skip) || 0
    let distance = parseInt(query.distance) || 5000000 // meters
    let filter = query.filter || null
    if (filter !== null) filter = filter.split('-')

    let userData = await db.collection('users').findOne({UID: session.UID}, {projection: {_id: 0, location: 1, reddit_subscriptions: 1}})
    let userSubs = userData.reddit_subscriptions.filter(item => item.hide === false).map(item => item.id)

    let projection = {
      _id: 0,
      UID: 1,
      reddit_username: {
        $cond: {
          if: {$eq: [false, "$settings.show_reddit_username"]},
          then: "$$REMOVE",
          else: "$reddit_username"
        }
      },
      prefered_name: 1,
      gender: 1,
      main_picture: 1,
      reddit_subscriptions: {
        $filter: {
           input: "$reddit_subscriptions",
           as: "sub",
           cond: { $and: [{$eq: [false, "$$sub.hide"]}, {$in: ["$$sub.id", userSubs]}] }
        }
      },
      distance: 1
    }
    let geoQuery = {"activate_profile": true}
    if (filter !== null) geoQuery["reddit_subscriptions.id"] = {$all: filter}
    let results = await db.collection('users').aggregate([
      {$geoNear: {
        spherical: true,
        near: userData.location,
        distanceField: "distance", // distance is off by about 1-20km (less than 1 percent) and I don't know why
        maxDistance: distance,
        query: geoQuery
      }},
      {$skip: skip},
      {$limit: limit},
      {$project: projection}
    ]).toArray()

    return {data: results}
  }
}

module.exports = new People()
