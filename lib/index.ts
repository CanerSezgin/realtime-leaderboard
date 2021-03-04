import redis from "redis"
import ioredis from "ioredis"
import Leaderboard from "./Leaderboard"

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

const options = {}

const ioRedisClient = new ioredis(config)

const lb1 = new Leaderboard(redisClient, 'lbId', options)
const lb2 = new Leaderboard(ioRedisClient, "lb2", options)
lb1.hi()
lb2.hi()

export function add(a: number, b: number) {
    return a + b;
}

console.log(add(3, 16))