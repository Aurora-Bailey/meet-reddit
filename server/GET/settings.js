const mongodb = require('../mongodb.js')
const lib = require('../lib.js')

class Settings {
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

    let results = await db.collection('users').findOne({UID: session.UID}, {projection: {_id: 0}})
    if (results === null) return {error: 'User not found!'}

    return results
  }
}

module.exports = new Settings()
