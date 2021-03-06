import redis from 'redis';
import ioredis from "ioredis";
import { promisify } from 'util';

const config = {
    host: "localhost",
    port: 6379,
    db: 10
};

export const redisClient = redis.createClient(config)
    .on('error', function (err) {
        console.log("error", err);
    })
    .on('connect', function () { })

const redisClientHelpers = {
    flush: promisify(redisClient.flushdb).bind(redisClient),
    quit: async () => {
        await new Promise((resolve) => {
            redisClient.quit(() => {
                resolve(null);
            });
        });
        await new Promise(resolve => setImmediate(resolve));
    }
}

export const ioRedisClient = new ioredis(config);

beforeAll(async () => {
    await redisClientHelpers.flush();
});

afterAll(async () => {
    await redisClientHelpers.quit();
});