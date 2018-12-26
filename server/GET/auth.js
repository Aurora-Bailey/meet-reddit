const reddit = require('../reddit_api/reddit.js')

class RedditAuth {
  constructor () {

  }

  async request (query) {
    return {url: reddit.authorizationURL()}
  }
}

module.exports = new RedditAuth()
