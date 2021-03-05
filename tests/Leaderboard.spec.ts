import { clientForRedis } from "./redisClients"
import { RedisClientType } from "../lib/CustomRedisClient"
import Leaderboard, { LeaderboardOptions, LeaderboardUpdateOptions } from "../lib/Leaderboard"
import { createUsersWithScore } from "./helper/user"
import { User, userId } from "../lib/types"

const LBTestMethods = (LB: Leaderboard) => {
    return {
        addUser: async (user: User) => {
            const result = await LB.addUser(user.userId, user.score)
            expect(result).toBe(1);
        },
        getScore: async (userId: userId, expectedScore: number) => {
            const score = await LB.getScore(userId)
            expect(score).toBe(expectedScore)
            return score;
        },
        getRank: async (userId: userId, expectedRank: number) => {
            const rank = await LB.getRank(userId);
            expect(rank).toBe(expectedRank)
            return rank;
        },
        getListBetween: async (startRank: number, endRank: number, expectedList: User[]) => {
            const list = await LB.getListBetween(startRank, endRank);
            console.log({ list, expectedList })

            expect(list[0].rank).toBe(startRank);
            expect(list[list.length - 1].rank).toBe(endRank);

            list.forEach((player, index) => {
                expect(player).toEqual(expect.objectContaining(expectedList[index]))
            });

            return list
        }
    }
}

// Test Helpers
const getSortedList = (users: User[]) => JSON.parse(JSON.stringify(users)).sort((a: User, b: User) => b.score - a.score)
const getIndexOfUser = (users: User[], userId: userId) => {
    const sortedList = getSortedList(users);
    return sortedList.findIndex((user: User) => user.userId === userId) + 1
}
const getUsersBetween = (users: User[], start: number, end: number) => {
    const sortedList = getSortedList(users);
    return sortedList.slice(start - 1, end);
}

describe('Leaderboard with "redis". Happy Path Tests', () => {
    let LB: Leaderboard;
    const leaderboardId = "leaderboard_test_redis"
    const lbOptions: LeaderboardOptions = {
        update: "onlyCreate" as LeaderboardUpdateOptions
    }
    const users = createUsersWithScore(5);
    const firstUser = users[0];

    console.log(users)

    it("create leaderboard with 'redis'", async () => {
        LB = new Leaderboard(clientForRedis, leaderboardId, lbOptions)
        expect(LB).toEqual(expect.objectContaining({
            boardId: leaderboardId,
            opts: expect.any(Object),
            client: expect.any(Object),
            clientType: RedisClientType.RedisClient
        }))
    })

    it("save first user's result", async () => {
        const { userId, score } = firstUser;
        await LBTestMethods(LB).addUser(firstUser)
        await LBTestMethods(LB).getScore(userId, score)
    })

    it("save all other users' results", async () => {
        const otherUsers = users.slice(1)
        await Promise.all(otherUsers.map(user => LBTestMethods(LB).addUser(user)))
        await Promise.all(otherUsers.map(user => LBTestMethods(LB).getScore(user.userId, user.score)
        ))
    })

    it("get rank of user", async () => {
        const rank = await LBTestMethods(LB).getRank(firstUser.userId, getIndexOfUser(users, firstUser.userId))
        console.log(rank, firstUser)
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
        const list = await LBTestMethods(LB).getListBetween(start, end, expectedList);
        console.log(list, expectedList)
    })

    it("get users between rank 2:4", async () => {
        const start = 2;
        const end = 4;
        const expectedList = getUsersBetween(users, start, end)
        const list = await LBTestMethods(LB).getListBetween(start, end, expectedList);
        console.log(list, expectedList)
    })
})

describe('Leaderboard with "redis". Additional Tests', () => {
    const leaderboardId = "leaderboard_test_redis_additional"
    const lbOptions = {
        update: "onlyCreate" as LeaderboardUpdateOptions
    }
    const LB = new Leaderboard(clientForRedis, leaderboardId, lbOptions);
    const users = createUsersWithScore(5);
    const firstUser = users[0];

    console.log(users)

    it("new leaderboard should be empty", async () => {
        const list = await LB.getListBetween();
        expect(list.length).toBe(0)
    })

    it("save first user's results", async () => {
        const { userId, score } = firstUser;
        await LBTestMethods(LB).addUser(firstUser)
        await LBTestMethods(LB).getScore(userId, score)
    })

    it("save first user's results one more time", async () => {
        const { userId } = firstUser
        const result = await LB.addUser(userId, 1000)
        const score = await LB.getScore(userId);
        const list = await LB.getListBetween();
        console.log({ result, score, list })
    })

})
