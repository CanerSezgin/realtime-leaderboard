import { promisify } from "util"

export enum RedisClientType {
    RedisClient = "RedisClient",
    Redis = "Redis"
}
class CustomRedisClient {
    public type: RedisClientType
    public get: Function
    public set: Function
    public del: Function
    public zrange: Function
    public zadd: Function
    public zscore: Function
    public zrevrange: Function
    public zrevrank: Function
    constructor(redisClient: any) {
        const clientType = CustomRedisClient.getClientType(redisClient);
        this.init(redisClient, clientType)
    }

    private static getClientType(redisClient: any): RedisClientType {
        return redisClient.constructor.name
    }

    private init(redisClient: any, type: RedisClientType) {
        if (type === RedisClientType.RedisClient) {
            this.type = type
            this.get = promisify(redisClient.get).bind(redisClient)
            this.set = promisify(redisClient.set).bind(redisClient)
            this.del = promisify(redisClient.del).bind(redisClient)
            this.zrange = promisify(redisClient.zrange).bind(redisClient)
            this.zadd = promisify(redisClient.zadd).bind(redisClient)
            this.zscore = promisify(redisClient.zscore).bind(redisClient)
            this.zrevrange = promisify(redisClient.ZREVRANGE).bind(redisClient)
            this.zrevrank = promisify(redisClient.zrevrank).bind(redisClient)

        } else if (type === RedisClientType.Redis) {
            this.type = type;
            this.get = () => { }
            this.set = () => { }
            this.del = () => { }
            this.zrange = () => { }
            this.zadd = () => { }
            this.zscore = () => { }
            this.zrevrange = () => { }
            this.zrevrank = () => { }
        } else {
            throw Error("Redis client is not supported. Supported Clients: { redis, ioredis }")
        }
    }
}

export default CustomRedisClient