// const MongoDB = require('../api/mongodb.js')

class RedditAuth {
  constructor () {

  }

  async request (query) {
    query.example = parseInt(query.example) || 10000000000
    return {test: true}
  }
}

module.exports = new RedditAuth()
