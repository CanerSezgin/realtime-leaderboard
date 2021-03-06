import { redisClient, ioRedisClient } from "./helper/redisClients"
import { RedisClientType } from "../lib/CustomRedisClient"
import { CustomRedisClient } from "../lib/CustomRedisClient"
import { Leaderboard } from "../lib/Leaderboard"

describe('create custom redis client', () => {
    it("should be created with (redis)", async () => {
        const client = new CustomRedisClient(redisClient)
        expect(client).toEqual(expect.objectContaining({
            type: RedisClientType.RedisClient
        }))
    })

    it("should be created with (ioredis)", async () => {
        const client = new CustomRedisClient(ioRedisClient)
        expect(client).toEqual(expect.objectContaining({
            type: RedisClientType.Redis
        }))
    })

    it("throws error if unsupported redis client passed", async () => {
        try {
            const client = new CustomRedisClient({ client: "unsupported" })
            expect.hasAssertions()
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    })

})

describe('create leaderboard', () => {
    it("with customRedisClient", async () => {
        const leaderboardId = "leaderboard_with_customRedisClient"
        const customRedisClient = new CustomRedisClient(redisClient);
        const leaderboard = new Leaderboard(customRedisClient, leaderboardId, { update: "createOnly" })
        expect(leaderboard).toEqual(expect.objectContaining({
            leaderboardId: leaderboardId,
            opts: expect.any(Object),
            client: expect.any(Object),
            clientType: RedisClientType.RedisClient
        }))
    })
})