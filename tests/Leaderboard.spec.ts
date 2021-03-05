import { redisClient } from "./redisClients"
import { RedisClientType } from "../lib/CustomRedisClient"
import Leaderboard, { LeaderboardOptions, LeaderboardUpdateOptions } from "../lib/Leaderboard"
import { createUsersWithScore } from "./helper/user"
import { LBTestMethods, getIndexOfUser, getSortedList, getUsersBetween } from "./helper/leaderboardHelpers"

describe('Leaderboard with (redis). Happy Path Tests', () => {
    let LB: Leaderboard;
    const leaderboardId = "leaderboard_test_redis"
    const lbOptions: LeaderboardOptions = {
        update: LeaderboardUpdateOptions.createOnly
    }
    const users = createUsersWithScore(5);
    const firstUser = users[0];

    it("create leaderboard with 'redis'", async () => {
        LB = new Leaderboard(redisClient, leaderboardId, lbOptions)
        expect(LB).toEqual(expect.objectContaining({
            boardId: leaderboardId,
            opts: expect.any(Object),
            client: expect.any(Object),
            clientType: RedisClientType.RedisClient
        }))
    })

    it("save first user's result", async () => {
        const { userId, score } = firstUser;
        await LBTestMethods(LB).createUser(firstUser)
        await LBTestMethods(LB).getScore(userId, score)
    })

    it("save all other users' results", async () => {
        const otherUsers = users.slice(1)
        await Promise.all(otherUsers.map(user => LBTestMethods(LB).createUser(user)))
        await Promise.all(otherUsers.map(user => LBTestMethods(LB).getScore(user.userId, user.score)
        ))
    })

    it("get rank of user", async () => {
        await LBTestMethods(LB).getRank(firstUser.userId, getIndexOfUser(users, firstUser.userId))
    })

    it("get full list", async () => {
        const list = await LB.getListBetween();
        expect(list.length).toBe(users.length);
        list.forEach((player, index) => {
            expect(player).toEqual(expect.objectContaining(getSortedList(users)[index]))
        });
    })

    it("get top 3", async () => {
        const start = 1;
        const end = 3;
        const expectedList = getUsersBetween(users, start, end)
        await LBTestMethods(LB).getListBetween(start, end, expectedList);
    })

    it("get users between rank 2:4", async () => {
        const start = 2;
        const end = 4;
        const expectedList = getUsersBetween(users, start, end)
        const list = await LBTestMethods(LB).getListBetween(start, end, expectedList);
    })
})
