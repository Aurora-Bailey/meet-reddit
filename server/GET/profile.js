const mongodb = require('../mongodb.js')
const lib = require('../lib.js')

class Profile {
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
    if (typeof query.uid === 'undefined') return {error: 'No user specified!'}
    let UID = query.uid

    let userData = await db.collection('users').findOne({UID: session.UID}, {projection: {_id: 0, reddit_subscriptions: 1}})
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
      reddit_user_images: {
        $cond: {
          if: {$eq: [false, "$settings.show_user_reddit_images"]},
          then: "$$REMOVE",
          else: "$reddit_user_images"
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
      }
    }
    let results = await db.collection('users').aggregate([
      {$match: {UID}},
      {$project: projection}
    ]).toArray()
    if (results.length !== 1) return {error: 'User not found!'}

    return results[0]
  }
}

module.exports = new Profile()
