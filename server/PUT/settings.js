// const MongoDB = require('../api/mongodb.js')

class Settings {
  constructor () {

  }

  async request (query) {
    query.example = parseInt(query.example) || 10000000000
    return {test: true}
  }
}

module.exports = new Settings()
