// enable or disable push notifications
// const MongoDB = require('../api/mongodb.js')

class Push {
  constructor () {

  }

  async request (req) {
    let headers = req.headers
    let query = req.query
    let params = req.params
    let body = req.body

    return {test: true}
  }
}

module.exports = new Push()
