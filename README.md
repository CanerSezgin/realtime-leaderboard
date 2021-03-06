<h1 align="center" style="border-bottom: none">Real Time Leaderboard 🥇🥈🥉</h1>
<h3 align="center">Powerful Scalable real-time Leaderboards using <a href="https://redis.io">Redis</a> for million+ users.</h3>
<b>Supported Redis Clients:</b> <a href="https://www.npmjs.com/package/redis">redis</a> && <a href="https://www.npmjs.com/package/ioredis">ioredis</a>

# Features

- **Lightweight**: no dependency requirements other than your redis client.
- **Different Redis client support**: This package works with <a href="https://www.npmjs.com/package/redis">redis</a> or <a href="https://www.npmjs.com/package/ioredis">ioredis</a> clients.
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise based</a>
- <a href="https://www.typescriptlang.org/">TypeScript</a> definitions
- Tested
- Powerful & Quick for over million users.
- Multiple real-time leaderboards
- **Different Score Update Strategies**: Different score update strategies can be set according to your app business logic for each leaderboard. More: **<a href="">Score Update Strategies</a>**

# Installation

### Install package(s)

`$ npm install realtime-leaderboard`

⚠️ Make sure you already have redis client, if you don't, <a href="https://www.npmjs.com/package/redis">redis</a> or <a href="https://www.npmjs.com/package/ioredis">ioredis</a> can be installed.
<br>
`$ npm install redis` **or** `$ npm install ioredis`

### Create || Get your redis client

This package requires your redis client.

#### redis client initilization: <a href="https://www.npmjs.com/package/redis">more</a>

```
const  redis = require("redis")
const  redisClient = redis.createClient({host:  "localhost",port:  6379})
```

#### ioredis client initilization <a href="https://www.npmjs.com/package/ioredis">more</a>

```
const { Redis } = require('ioredis');
const redisClient =  new  Redis({ host:  "localhost", port:  6379});
```

### Create your Real-time Leaderboard

```
const { Leaderboard } = require("realtime-leaderboard");
const  lb = new  Leaderboard(redisClient, "leaderboardId", { update: "createAndUpdateIfGrater" });
```

### Leaderboard Method Example

```
await  lb.updateUser("user1", 15) 				// creates user1 since user not exist
await  lb.createUser("user2", 32) 				// creates user2
await  lb.updateUser("user1", 200) 				// update user1 since newScore is greater
const  board = await  lb.getListBetween(1, 7); 	// [{ user1 }, { user2 }]
const  rank = await  lb.getRank("user2")		// 2
```

See more **<a href="">Score Update Strategies</a>**

# License

[MIT](https://github.com/CanerSezgin/realtime-leaderboard/blob/master/LICENSE)
