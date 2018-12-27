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


  degreesToRadians(degrees) {
    return degrees * Math.PI / 180
  }

  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    let earthRadiusKm = 6371

    let dLat = this.degreesToRadians(lat2-lat1)
    let dLon = this.degreesToRadians(lon2-lon1)

    lat1 = this.degreesToRadians(lat1)
    lat2 = this.degreesToRadians(lat2)

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return earthRadiusKm * c
  }
}

module.exports = new Lib()
