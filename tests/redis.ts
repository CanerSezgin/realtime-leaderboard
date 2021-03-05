import redis from 'redis';
import ioredis from "ioredis";
import CustomRedisClient from "../lib/CustomRedisClient"

const config = {
    host: "localhost",
    port: 6379,
};

const redisClient = redis.createClient(config);
const ioRedisClient = new ioredis(config);

const clientForRedis = new CustomRedisClient(redisClient);
const clientForIORedis = new CustomRedisClient(ioRedisClient);

beforeEach((done) => {
    console.log("redisclient flushing")
});
afterAll(() => {
    redisClient.quit();
});

export default redisClient;
