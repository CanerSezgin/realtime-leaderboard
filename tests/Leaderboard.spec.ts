import { clientForRedis } from "./redisClients"
import { RedisClientType } from "../lib/CustomRedisClient"
import Leaderboard from "../lib/Leaderboard"

describe('Leaderboard with "redis"', () => {

    let leaderboard;
    const leaderboardId = "leaderboard_test_redis"
    const lbOptions = {}
    it("create leaderboard with 'redis'", async () => {
        leaderboard = new Leaderboard(clientForRedis, leaderboardId, lbOptions)
        expect(leaderboard).toEqual(expect.objectContaining({
            boardId: leaderboardId,
            opts: expect.any(Object),
            client: expect.any(Object),
            clientType: RedisClientType.RedisClient
        }))
    })
})

