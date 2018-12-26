const reddit = require('../reddit_api/reddit.js')

class Auth {
  constructor () {

  }

  async request (query) {
    return {url: reddit.authorizationURL()}
  }
}

module.exports = new Auth()
