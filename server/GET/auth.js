const reddit = require('../reddit_api/reddit.js')

class Auth {
  constructor () {

  }

  async request (req) {
    let headers = req.headers
    let query = req.query
    let params = req.params
    let body = req.body

    return {url: reddit.authorizationURL()}
  }
}

module.exports = new Auth()
