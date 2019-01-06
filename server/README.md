# To run server
```bash
git pull
npm install
npm run server
```

# API Documentation
### Index
###### Account
* [GET: /auth](#get-auth)
* [PUT: /auth](#put-auth)
* [PUT: /push](#put-push)
* [PUT: /settings](#put-settings)
* [GET: /settings](#get-settings)
###### Communication
* [GET: /messages](#get-messages)
* [GET: /chatroom](#get-chatroom)
* [WebSocket: /server](#websocket-server)
###### Content
* [GET: /people](#get-people)
* [GET: /profile](#get-profile)
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
##### GET: /chatroom
* TODO
* Get the websocket address for a chat room
	##### Fields:
  Header
  ```
  authorization: Bearer DS--s-_ksIKofkBnIDb1NetW451WUlNQShjVpQGi
  ```
  Query
  ```
  crid=fdgh6908dfg
  ```

	##### Example:
	```
 	GET: http://localhost:8176/chatroom?crid=fdgh6908dfg

  {
		address: 'ws://localhost:8175/45'
	}
	```
##### WebSocket: /server
* TODO
* Get and send messages to a chat room
	##### Fields:
  JSON
  ```
	{
		"authorization": "Bearer DS--s-_ksIKofkBnIDb1NetW451WUlNQShjVpQGi",
		"sync": 150,
		"post": "This is a message!",
		"delete": "h6sd9f08g7",
		"request": "986hds98f7" // string used to pair response to request
	}
  ```

	##### Example:
	```
 	WebSocket: ws://localhost:8175/45
	```

### Content
##### GET: /people
* Get a list of all the people in your area
	##### Fields:
  Header
  ```
  authorization: Bearer DS--s-_ksIKofkBnIDb1NetW451WUlNQShjVpQGi
  ```
  Query
  ```
  limit=100
  skip=200
  distance=10000 // meters
  filter=2fw02-asdf // dash separated
  ```

	##### Example:
	```
 	GET: http://localhost:8176/people?distance=100000

	{
	    "data": [
	        {
	            "UID": "Se8G5Zg30f",
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
	            "distance": 0,
	            "reddit_subscriptions": [
	                {
	                    "name": "node",
	                    "id": "2reca",
	                    "favorited": false,
	                    "contributor": false,
	                    "hide": false
	                },
	                {
	                    "name": "science",
	                    "id": "mouw",
	                    "favorited": false,
	                    "contributor": false,
	                    "hide": false
	                }
	            ]
	        },
	        {
	            "UID": "YlzbME6bWd",
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
	            "distance": 1006596.1828800607,
	            "reddit_username": "Alasa-Lerin",
	            "reddit_subscriptions": [
	                {
	                    "name": "node",
	                    "id": "2reca",
	                    "favorited": true,
	                    "contributor": false,
	                    "hide": false
	                }
	            ]
	        }
	    ]
	}
	```
##### GET: /profile
* Get information for a single person
	##### Fields:
  Header
  ```
  authorization: Bearer DS--s-_ksIKofkBnIDb1NetW451WUlNQShjVpQGi
  ```
  Query
  ```
  uid=ah687dsfs9d8f7
  ```

	##### Example:
	```
 	GET: http://localhost:8176/profile?uid=h6a98sd6f9087

	{
    "UID": "f_VcoY2h5o",
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
    "reddit_user_images": []
  }
	```
