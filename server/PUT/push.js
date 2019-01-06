const mongodb = require('../mongodb.js')
const lib = require('../lib.js')

class Push {
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

    // validate data
    try {
      // overall length
      if (JSON.stringify(body).length > 500) throw 'Oversized request!'
      // valid endpoint
      let urlRegex = new RegExp('^https?://')
      if (!urlRegex.test(body.endpoint)) throw 'Malformed endpoint!'
    } catch (error) {
      return {error}
    }

    let pushNotification = {
      UID: session.UID,
      PNID: lib.makeid(30),
      valid: true,
      endpoint: body.endpoint, // for unique index
      subscription: body
    }

    await db.collection('push').createIndex('PNID', {unique: true, name: 'PNID'})
    await db.collection('push').createIndex('UID', {name: 'UID'})
    await db.collection('push').createIndex('valid', {name: 'valid'})
    await db.collection('push').createIndex('endpoint', {unique: true, name: 'endpoint'})
    try {
      var success = await db.collection('push').insertOne(pushNotification)
    } catch (e) {
      return {status: false}
    }

    return {status: true}
  }
}

module.exports = new Push()
