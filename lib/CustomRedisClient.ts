import { promisify } from "util"

export enum RedisClientType {
    RedisClient = "RedisClient",
    Redis = "Redis"
}
export class CustomRedisClient {
    public type: RedisClientType
    public zrange: Function
    public zadd: Function
    public zscore: Function
    public zrevrange: Function
    public zrevrank: Function
    public zremrangebyrank: Function
    public zcount: Function
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
            this.zrange = promisify(redisClient.zrange).bind(redisClient)
            this.zadd = promisify(redisClient.zadd).bind(redisClient)
            this.zscore = promisify(redisClient.zscore).bind(redisClient)
            this.zrevrange = promisify(redisClient.ZREVRANGE).bind(redisClient)
            this.zrevrank = promisify(redisClient.zrevrank).bind(redisClient)
            this.zremrangebyrank = promisify(redisClient.zremrangebyrank).bind(redisClient)
            this.zcount = promisify(redisClient.zcount).bind(redisClient)

        } else if (type === RedisClientType.Redis) {
            this.type = type;
            this.zrange = redisClient.zrange.bind(redisClient)
            this.zadd = redisClient.zadd.bind(redisClient)
            this.zscore = redisClient.zscore.bind(redisClient)
            this.zrevrange = redisClient.zrevrange.bind(redisClient)
            this.zrevrank = redisClient.zrevrank.bind(redisClient)
            this.zremrangebyrank = redisClient.zremrangebyrank.bind(redisClient)
            this.zcount = redisClient.zcount.bind(redisClient)
        } else {
            throw Error(`Redis client is not supported. Supported Clients: { redis, ioredis }
            Install One of Redis Packages
            >>> npm install redis
            >>> npm install ioredis`)
        }
    }
}