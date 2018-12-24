const {MongoClient} = require('mongodb')

class Mongo {
  constructor() {
    this._url = 'mongodb://localhost:27017'
    this._client = false
  }

  close () {
    if (this._client) this._client.close()
  }

  async db (dbName) {
    let client = await this.connect()
    return client.db(dbName)
  }

  async connect () {
    if (this._client) return this._client
    else {
      this._client = await MongoClient.connect(this._url, { useNewUrlParser: true })
      return this._client
    }
  }
}

module.exports = new Mongo()
