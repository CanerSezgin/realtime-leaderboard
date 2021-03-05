import redis from "redis"
import ioredis from "ioredis"
import Leaderboard from "./Leaderboard"
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

const options = {}

const ioRedisClient = new ioredis(config)

const lb1 = new Leaderboard(redisClient, 'lbId', options)
const lb2 = new Leaderboard(ioRedisClient, "lb2", options)

const customClient1 = new CustomRedisClient(redisClient)
const lb3 = new Leaderboard(customClient1, "lb3", options)
console.log(lb3)

const main = async () => {
    const user1 = await lb1.addUser("user1", 5)
    const user2 = await lb1.addUser("user2", 9)
    const user3 = await lb1.addUser("user3", 3)
    console.log({ user1, user2, user3 })
    const score1 = await lb1.getScore("user1")
    const score2 = await lb1.getScore("user2")
    const score3 = await lb1.getScore("user3")
    console.log({ score1, score2, score3 })
    const u1Rank = await lb1.getRank("user1");
    console.log({ u1Rank });
    const range = await lb1.getBetween();
    console.log({range})

}

main();

