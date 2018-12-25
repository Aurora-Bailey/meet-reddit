const axios = require('axios')
const credentials = require('./credentials.json')

class Reddit {
  constructor () {

  }

  authorizationURL () {
    return `https://www.reddit.com/api/v1/authorize?client_id=${credentials.app_id}&response_type=code&state=true&redirect_uri=${credentials.redirect_uri}&duration=temporary&scope=mysubreddits identity`
    // success: http://localhost:8176/auth?state=true&code=E5B0hsdBtA80yPa2DNKdeGjg7t0
    // fail: http://localhost:8176/auth?state=true&error=access_denied
  }

  async authorizationCodeToAccessToken (authCode) {
    let response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      `grant_type=authorization_code&code=${authCode}&redirect_uri=${credentials.redirect_uri}`,
      {headers: {authorization: 'Basic ' + Buffer.from(credentials.app_id + ':' + credentials.secret).toString('base64')}}
    )
    if (!response.data.error) return response.data
    else throw response.data
  }

  async accessTokenToUser (token) {
    let response = await axios.get(
      'https://oauth.reddit.com/api/v1/me',
      {headers: {"Authorization": token.token_type + ' ' + token.access_token, "User-Agent": this.userAgent()}}
    )
    return response.data
  }

  async accessTokenToSubscriptions (token) {
    let maxPages = 20 // 2000 subreddits
    var subscriptions = []
    var after = null
    do {
      let qs = {}
      qs.limit = 100
      qs.count = subscriptions.length
      if (after) qs.after = after

      let response = await axios.get(
        'https://oauth.reddit.com/subreddits/mine/subscriber',
        {params: qs, headers: {"Authorization": token.token_type + ' ' + token.access_token, "User-Agent": this.userAgent()}}
      )
      response.data.data.children.forEach(child => {subscriptions.push({name: child.data.display_name, id: child.data.id, favorited: child.data.user_has_favorited, contributor: child.data.user_is_contributor})})
      after = response.data.data.after
      maxPages--
    } while (after !== null && typeof after !== 'undefined' && maxPages > 0)

    return subscriptions
  }

  userAgent () {
    return `node:${credentials.app_name}:${credentials.version} (by /u/${credentials.username})`.toLowerCase()
  }
}

module.exports = new Reddit()
