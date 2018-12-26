const mongodb = require('./mongodb.js')

class Lib {
  constructor () {

  }

  async fetchSession (SID) {
    if (typeof SID !== 'string' || SID.length > 100) return null
    let db = await mongodb.db('meet_reddit')
    let session = await db.collection('sessions').findOne({SID, valid: true}, {projection: {_id: 0, reddit_access_token: 0}})
    return session
  }
}

module.exports = new Lib()
