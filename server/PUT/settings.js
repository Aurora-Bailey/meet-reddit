const mongodb = require('../mongodb.js')
const lib = require('../lib.js')

class Settings {
  constructor () {

  }

  async request (req) {
    let db = await mongodb.db('meet_reddit')
    let headers = req.headers
    let query = req.query
    let params = req.params
    let body = req.body

    // Session
    if (!headers.authorization || headers.authorization.split(' ').length < 2)
      return {error: 'Auth not found!'}
    let SID = headers.authorization.split(' ')[1]
    let session = await lib.fetchSession(SID)
    if (session === null) return {error: 'Invalid auth!'}

    // validate
    if (JSON.stringify(body).length > 500) return {error: "Oversized data!"}

    try {
      // build query
      let updateQuery = {}
      let options = {}
      if (typeof body.prefered_name === 'string' &&  body.prefered_name.length < 100)
      updateQuery["prefered_name"] = body.prefered_name
      if (typeof body.gender === 'string' &&  body.gender.length < 100)
      updateQuery["gender"] = body.gender
      if (typeof body.main_picture === 'string' &&  body.main_picture.length < 100)
      updateQuery["main_picture.RIID"] = body.main_picture
      if (typeof body.show_reddit_username !== 'undefined')
      updateQuery["settings.show_reddit_username"] = body.show_reddit_username == true
      if (typeof body.show_user_reddit_images !== 'undefined')
      updateQuery["settings.show_user_reddit_images"] = body.show_user_reddit_images == true
      if (typeof body.activate_profile !== 'undefined')
      updateQuery["settings.activate_profile"] = body.activate_profile == true
      if (typeof body.location !== 'undefined' && this.validLocation(body.location))
      updateQuery["location.coordinates"] = body.location
      if (typeof body.toggle_subscription_hidden !== 'undefined') {
        updateQuery["reddit_subscriptions.$[sub].hide"] = body.toggle_subscription_hidden[1] == true
        if (typeof options["arrayFilters"] === 'undefined') options["arrayFilters"] = []
        options["arrayFilters"].push({"sub.id": {$eq: body.toggle_subscription_hidden[0]}})
      }
      if (typeof body.toggle_image_hidden !== 'undefined') {
        updateQuery["reddit_subscriptions.$[img].hide"] = body.toggle_image_hidden[1] == true
        if (typeof options["arrayFilters"] === 'undefined') options["arrayFilters"] = []
        options["arrayFilters"].push({"img.id": {$eq: body.toggle_image_hidden[0]}})
      }
      if (typeof body.user_is_reading_chat !== 'undefined')
      updateQuery["user_is_reading_chat"] = body.user_is_reading_chat

      // run query

      let results = await db.collection('users').updateOne({UID: session.UID}, {$set: updateQuery}, options)
    } catch (e) {
      return {status: false}
    }


    return {status: true}
  }

  validLocation (arr) {
    if (arr.length !== 2) return false
    if (isNaN(arr[0]) || isNaN(arr[1])) return false
    if (arr[0] > 180 || arr[0] < -180) return false
    if (arr[1] > 90 || arr[1] < -90) return false
    return true
  }
}

module.exports = new Settings()
