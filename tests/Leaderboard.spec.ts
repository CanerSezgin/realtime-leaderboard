import { redisClient, ioRedisClient } from "./redisClients"
import { RedisClientType } from "../lib/CustomRedisClient"
import { Leaderboard, LeaderboardOptions, LeaderboardUpdateOptions } from "../lib/Leaderboard"
import { createUsersWithScore } from "./helper/user"
import { LBTestMethods, getIndexOfUser, getSortedList, getUsersBetween } from "./helper/leaderboardHelpers"

describe.each([
    [redisClient, RedisClientType.RedisClient, "redis"],
    [ioRedisClient, RedisClientType.Redis, "ioredis"]
])('Leaderboard with ($clientName). Happy Path Tests', (client, clientType, clientName) => {

    let LB: Leaderboard;
    const leaderleaderboardId = `leaderboard_test_${clientName}`
    const lbOptions: LeaderboardOptions = {
        update: LeaderboardUpdateOptions.createOnly
    }
    const users = createUsersWithScore(5);
    const firstUser = users[0];

    it("create leaderboard", async () => {
        LB = new Leaderboard(client, leaderleaderboardId, lbOptions)
        expect(LB).toEqual(expect.objectContaining({
            leaderboardId: leaderleaderboardId,
            opts: expect.any(Object),
            client: expect.any(Object),
            clientType
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

    it("get score and rank of non-existing user", async () => {
        const userId = "non-existing-user";
        const score = await LB.getScore(userId)
        const rank = await LB.getRank(userId)
        expect(score).toBe(null);
        expect(rank).toBe(null)
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
        await LBTestMethods(LB).getListBetween(start, end, expectedList);
    })

    it("get number of users in the leaderboard", async () => {
        const noOfUsers = await LB.getNoOfUsers()
        expect(noOfUsers).toBe(users.length)
    })

    it("reset leaderboard", async () => {
        const list = await LB.getListBetween();
        expect(list.length).not.toBe(0);
        await LB.resetLeaderboard();
        const listAfterReset = await LB.getListBetween();
        expect(listAfterReset.length).toBe(0)
    })
})