# To run server
```bash
git pull
npm install
npm run server
```

# API Documentation
### Index
* [GET: /auth](#get-auth)
* [PUT: /auth](#put-auth)
* [PUT: /push](#put-push)
* [PUT: /settings](#put-settings)
* [GET: /settings](#get-settings)
* [GET: /messages](#get-messages)
* [WebSocket: /chat](#websocket-chat)
### Account
##### GET: /auth
* Returns reddit authorization URL used to generate a reddit access code
	##### Fields:
    ```
    ```

	##### Example:
	```
	GET: http://localhost:8176/auth

	{
		"url": "https://www.reddit.com/api/v1/authorize?client_id=Ajs40cMfjDGghw&response_type=code&state=true&redirect_uri=http://localhost:8176/redditauth&duration=temporary&scope=mysubreddits identity"
	}
	```
##### PUT: /auth
* Accepts reddit authorization code returns session token, also updates subreddits and creates a new account
	##### Fields:
    Body
    ```
    {
		"code": "m-prnIth4zoLHnUzsN4QD9R955cYfc",
		"state": "unused" // optional
    }
    ```
	##### Example:
	```
 	PUT: http://localhost:8176/auth

	{
		"token": "u-csv8GNxHM-d-xyHt7Y_zEONU5H-ggpYvZa1hk8"
  	}
	```
##### PUT: /push
* TODO
* Enable push notifications. Accepts push notification object, returns notification status.
	##### Fields:
  Header
    ```
    authorization: Bearer DS--s-_ksIKofkBnIDb1NetW451WUlNQShjVpQGi
    ```
  Body
    ```
    {
      endpoint: "https://fcm.googleapis.com/fcm/send/dkDX0AATcGjrFF2FEEZE6XeERo0",
      expirationTime: null,
      keys: {
        p256dh: "BGo3oddPEftD0uSpaVZsWX_NGtfXPaYdfb6PlqUJbQ9sUEOA2uhJnYSBWXLOuY6qI",
        auth: "C1Yqq6c5pQ1dyzvilwDH9kwRNAA"
      }
    }
    ```

	##### Example:
	```
 	PUT: http://localhost:8176/push

	{
		"status": "enabled"
 	}
	```

##### PUT: /settings
* TODO
* Change a setting. Accepts a new setting, returns success or failure.
	##### Fields:
  Header
    ```
    authorization: Bearer DS--s-_ksIKofkBnIDb1NetW451WUlNQShjVpQGi
    ```
  Body
    ```
    All fields are optional
    {
      prefered_name: 'Alasa',
      gender: 'Male',
      main_picture: 'h6a9sd8f7598a7sdf',
      show_reddit_username: true,
      show_user_reddit_images: true,
      activate_profile: false,
      location: [12.345, 64.89], // lon|lat
      toggle_subscription_hidden: '2fw02',
      toggle_image_hidden: 'D34gad-gf23fg3_asd',
      toggle_active_chat_room: 'a58ash698fdsdf96',
      user_is_reading_chat: 'h5875df87sad60sd987',
    }
    ```

	##### Example:
	```
 	PUT: http://localhost:8176/settings

	{
		"status": true
 	}
	```
##### GET: /settings
* TODO
* Get user settings. Pretty much just dump the user object.
	##### Fields:
  Header
    ```
    authorization: Bearer DS--s-_ksIKofkBnIDb1NetW451WUlNQShjVpQGi
    ```

	##### Example:
	```
 	GET: http://localhost:8176/settings

  {
    "_id": "5c22dac4fdf58931a8aae1bd",
    "UID": "f_VcoY2h5o",
    "reddit_id": "sxx6vo3",
    "reddit_username": "Alasa-Lerin",
    "prefered_name": "",
    "gender": "",
    "main_picture": {
      "url": {
        "small": "",
        "medium": "",
        "large": "",
        "original": ""
      },
      "RIID": ""
    },
    "settings": {
      "show_reddit_username": true,
      "show_user_reddit_images": true,
      "activate_profile": false
    },
    "location": {
      "type": "Point",
      "coordinates": [
        0,
        0
      ]
    },
    "reddit_subscriptions": {
      "2fwo": {
        "name": "programming",
        "id": "2fwo",
        "favorited": true,
        "contributor": false,
        "hide": false
      },
      "2qh30": {
        "name": "javascript",
        "id": "2qh30",
        "favorited": false,
        "contributor": false,
        "hide": false
      }
    },
    "reddit_user_images": [],
    "active_chatrooms": {},
    "user_is_reading_chat": false
  }
	```

### Communication
##### GET: /messages
* TODO
* Get all the messages missed from timestamp on to update settings/active_chatrooms
	##### Fields:
  Header
  ```
  authorization: Bearer DS--s-_ksIKofkBnIDb1NetW451WUlNQShjVpQGi
  ```
  Query
  ```
  timestamp=1546212433890
  ```

	##### Example:
	```
 	GET: http://localhost:8176/messages?timestamp=1546212433890

  active_chatrooms: {
		"CRID": {
			"room_name": "List of users in chat minus current user",
			"room_picture": "h6897dsfa98"
			"last_active": 123456789,
			"last_message": "string",
			"read": false
			"hide": false
		},
		"g5a8s9df": {
			"room_name": "List of users in chat minus current user",
			"room_picture": "h6897dsfa98"
			"last_active": 123456789,
			"last_message": "string",
			"read": false
			"hide": false
		}
	}
	```
##### WebSocket: /chat
* TODO
* Get messages from a chat room
	##### Fields:
  Header
  ```
  authorization: Bearer DS--s-_ksIKofkBnIDb1NetW451WUlNQShjVpQGi
  ```
  Query
  ```
  ```

	##### Example:
	```
 	GET: http://localhost:8176/chat
	```

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
