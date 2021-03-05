import redis from "redis"
import ioredis from "ioredis"
import Leaderboard, { LeaderboardOptions, LeaderboardUpdateOptions } from "./Leaderboard"
import CustomRedisClient from "./CustomRedisClient";

const config = {
    host: "localhost",
    port: 6379,
};

const redisClient = redis.createClient(config)

redisClient.on("error", (err: any) => {
    console.log("Redis Error | ", err);
});

redisClient.on("ready", () => {
    console.log("✓ REDIS: Redis is Ready.");
});

const options: LeaderboardOptions = {
    update: LeaderboardUpdateOptions.onlyCreate
}

const ioRedisClient = new ioredis(config)

/* const lb1 = new Leaderboard(redisClient, 'lbId', options)
 */

