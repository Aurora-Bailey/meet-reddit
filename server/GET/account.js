// const MongoDB = require('../api/mongodb.js')

class Account {
  constructor () {

  }

  async request (query) {
    query.example = parseInt(query.example) || 10000000000
    return {test: true}
  }
}

module.exports = new Account()
