# To run server
```bash
git pull
npm install
npm run server
```

# API Documentation
## Account
- [x] GET: /auth
returns: reddit authorization URL
Example:
```
Request => GET: http://localhost:8176/auth
Response => {
  "url": "https://www.reddit.com/api/v1/authorize..."
}
```
	PUT: /auth
		accepts: reddit authorization token
		returns: session token
		// also updates subreddits and creates a new account
Example:  http://localhost:8176/auth?state=true&code=B6o6ViE8KvHNcSB9258XpxoYNBw
{"token": "u-csv8GNxHM-d-xyHt7Y_zEONU5H-ggpYvZa1hk8"}
	PUT: /push
		auth: required
		accepts: push notification object
		returns: true or false
		// enable push notifications
	GET: /settings
	PUT: /settings

Communication
	GET: /messages
	GET: /chat
	POST: /chat
	DELETE: /chat

Content
	GET: /people
		auth: required
		accepts: limit, skip, distance, filter
		returns: list of people near you
	GET: /profile

# TODO
- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item
