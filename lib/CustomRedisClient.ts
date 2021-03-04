import { promisify } from "util"

enum RedisClientType {
    RedisClient = "RedisClient",
    Redis = "Redis"
}

type CustomRedisClientType = {
    get: Function,
    set: Function,
    del: Function,
    zrange: Function,
    zadd: Function,
    zscore: Function,
    zrevrange: Function,
    zrevrank: Function
}

class CustomRedisClient {
    private type: RedisClientType;
    public client;
    constructor(redisClient: any) {
        this.type = this.getClientType(redisClient)
        this.client = this.setClient(redisClient)
    }

    private getClientType(redisClient: any): RedisClientType {
        return redisClient.constructor.name
    }

    private setClient(redisClient: any): CustomRedisClientType {
        if (this.type === RedisClientType.RedisClient) {
            return {
                get: promisify(redisClient.get).bind(redisClient),
                set: promisify(redisClient.set).bind(redisClient),
                del: promisify(redisClient.del).bind(redisClient),
                zrange: promisify(redisClient.zrange).bind(redisClient),
                zadd: promisify(redisClient.zadd).bind(redisClient),
                zscore: promisify(redisClient.zscore).bind(redisClient),
                zrevrange: promisify(redisClient.ZREVRANGE).bind(redisClient),
                zrevrank: promisify(redisClient.zrevrank).bind(redisClient),
            }
        } else if (this.type === RedisClientType.Redis) {
            return {
                get: () => { },
                set: () => { },
                del: () => { },
                zrange: () => { },
                zadd: () => { },
                zscore: () => { },
                zrevrange: () => { },
                zrevrank: () => { },
            }
        } else {
            throw Error("Redis client is not supported. Supported Clients: { redis, ioredis }")
        }
    }

}

export default CustomRedisClient