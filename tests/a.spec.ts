import redisClient from "./redis"

test('should return true given internal link', async () => {
    redisClient.ZADD("user1", 5)
})