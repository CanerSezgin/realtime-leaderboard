import { redisClient, ioRedisClient } from "./helper/redisClients"
import { RedisClientType } from "../lib/CustomRedisClient"
import { Leaderboard, LeaderboardOptions, LeaderboardUpdateOptions } from "../lib/Leaderboard"
import { createUsersWithScore } from "./helper/user"
import { LBTestMethods, getIndexOfUser, getSortedList, getUsersBetween } from "./helper/leaderboardHelpers"

describe.each([
    ["redis", redisClient],
    ["ioredis", ioRedisClient]
])('Leaderboard with (%s). Happy Path Tests', (clientName, client) => {

    const leaderboardId = `leaderboard_bulk_${clientName}`
    const lbOptions: LeaderboardOptions = {
        update: LeaderboardUpdateOptions.updateOnly
    }
    const LB = new Leaderboard(redisClient, leaderboardId, lbOptions);
    const users = createUsersWithScore(5);
    const firstUser = users[0];

    it("add users bulk", async () => {
        const results = await Promise.all(
            users.map(user => LB.createUser(user.userId, user.score))
        )
        results.forEach(r => {
            expect(r).toBe(1)
        })
    })

    it("get users bulk", async () => {
        const results = await Promise.all(
            users.map(user => LB.getScore(user.userId))
        )
        console.log(results)
        results.forEach((r, i) => {
            expect(r).toBe(users[i].score)
        })
    })

    describe("update users bulk", async () => {
        const newScores = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
        console.log({newScores})
        it("update", async () => {
            const results = await Promise.all(
                users.map((user, i) => LB.updateUser(user.userId, newScores[i]))
            )

            results.forEach(r => {
                expect(r).toBe(0)
            })
        })

        it("get scores after updates", async () => {
            const results = await Promise.all(
                users.map(user => LB.getScore(user.userId))
            )
            console.log(results)
            results.forEach((r, i) => {
                expect(r).toBe(newScores[i])
            })
        })
    })
})