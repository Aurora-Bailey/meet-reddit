const mongodb = require('../mongodb.js')

class People {
  constructor () {

  }

  // async request (query) {
  //   query.example = parseInt(query.example) || 10000000000
  //   let db = await mongodb.db('meet_reddit')
  //   let location = {
  //     $near: {
  //       $geometry: {type: "Point", coordinates: [0, 0]},
  //       $minDistance: 0, // in meters (not kilometers)
  //       $maxDistance: 5000000
  //     }
  //   }
  //   let p = await db.collection('users').find({location}).toArray()
  //   return {test: p.length}
  // }
  async request (req) {
    let headers = req.headers
    let query = req.query
    let params = req.params
    let body = req.body

    return {test: true}
  }
}

module.exports = new People()
