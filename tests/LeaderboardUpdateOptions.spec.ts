import { redisClient, ioRedisClient } from "./helper/redisClients"
import { LBTestMethods } from "./helper/leaderboardHelpers"
import { Leaderboard, LeaderboardOptions, LeaderboardUpdateOptions } from "../lib/Leaderboard"
import { createUserWithScore } from "./helper/user"

describe.each([
    [redisClient, "redis"],
    [ioRedisClient, "ioredis"]
])('Leaderboard Update Options Tests ($clientName)', (client, clientName) => {

    describe('createOnly', () => {
        const user = createUserWithScore();
        const leaderleaderboardId = `leaderboard_test_${clientName}_createOnly`
        const lbOptions: LeaderboardOptions = {
            update: LeaderboardUpdateOptions.createOnly
        }
        const LB = new Leaderboard(client, leaderleaderboardId, lbOptions)

        it("create user", async () => {
            const { userId, score } = user;
            await LBTestMethods(LB).createUser(user)
            await LBTestMethods(LB).getScore(userId, score)
        })

        it("update existing user's result", async () => {
            const { userId } = user
            const result = await LB.updateUser(userId, 1000)
            const score = await LB.getScore(userId);
            expect(result).toBe(0);
            expect(score).toBe(user.score);
        })
    })

    describe('updateOnly', () => {
        const user = createUserWithScore();
        const leaderleaderboardId = `leaderboard_test_${clientName}_updateOnly`
        const lbOptions: LeaderboardOptions = {
            update: LeaderboardUpdateOptions.updateOnly
        }
        const LB = new Leaderboard(client, leaderleaderboardId, lbOptions)

        it("update non-existing user's result", async () => {
            const { userId } = user
            const result = await LB.updateUser(userId, 1000)
            const score = await LB.getScore(userId);
            expect(result).toBe(0);
            expect(score).toBe(null);
        })

        it("create user", async () => {
            const { userId, score } = user;
            await LBTestMethods(LB).createUser(user)
            await LBTestMethods(LB).getScore(userId, score)
        })

        it("update existing user's result", async () => {
            const { userId } = user
            const result = await LB.updateUser(userId, 1000)
            const score = await LB.getScore(userId);
            expect(result).toBe(0);
            expect(score).toBe(1000);
        })
    })

    describe('createAndUpdateIfLess', () => {
        const user = createUserWithScore();
        const leaderleaderboardId = `leaderboard_test_${clientName}_createAndUpdateIfLess`
        const lbOptions: LeaderboardOptions = {
            update: LeaderboardUpdateOptions.createAndUpdateIfLess
        }
        const LB = new Leaderboard(client, leaderleaderboardId, lbOptions)

        it("create user", async () => {
            const { userId, score } = user;
            await LBTestMethods(LB).createUser(user)
            await LBTestMethods(LB).getScore(userId, score)
        })

        it("update existing user's result (Greater: not-update)", async () => {
            const { userId } = user
            const newScore = 1000;
            const result = await LB.updateUser(userId, newScore)
            const score = await LB.getScore(userId);
            const list = await LB.getListBetween();
            expect(result).toBe(0);
            expect(score).toBe(user.score);
            expect(list.length).toBe(1);
        })

        it("update non-existing user's result (Greater: create)", async () => {
            const userId = "non-existing-user"
            const newScore = 1000;
            const result = await LB.updateUser(userId, newScore)
            const score = await LB.getScore(userId);
            const list = await LB.getListBetween();
            expect(result).toBe(1);
            expect(score).toBe(newScore);
            expect(list.length).toBe(2);
        })

        it("update existing user's result (Less: update)", async () => {
            const { userId } = user
            const newScore = -1000;
            const result = await LB.updateUser(userId, newScore)
            const score = await LB.getScore(userId);
            const list = await LB.getListBetween();
            expect(result).toBe(0);
            expect(score).toBe(newScore);
            expect(list.length).toBe(2);
        })

        it("update non-existing user's result (Less: create)", async () => {
            const userId = "non-existing-user-2"
            const newScore = -1000;
            const result = await LB.updateUser(userId, newScore)
            const score = await LB.getScore(userId);
            const list = await LB.getListBetween();
            expect(result).toBe(1);
            expect(score).toBe(newScore);
            expect(list.length).toBe(3);
        })
    })

    describe('createAndUpdateIfGrater', () => {
        const user = createUserWithScore();
        const leaderleaderboardId = `leaderboard_test_${clientName}_createAndUpdateIfGrater`
        const lbOptions: LeaderboardOptions = {
            update: LeaderboardUpdateOptions.createAndUpdateIfGrater
        }
        const LB = new Leaderboard(client, leaderleaderboardId, lbOptions)

        it("create user", async () => {
            const { userId, score } = user;
            await LBTestMethods(LB).createUser(user)
            await LBTestMethods(LB).getScore(userId, score)
        })

        it("update existing user's result (Less: not-update)", async () => {
            const { userId } = user
            const newScore = -1000;
            const result = await LB.updateUser(userId, newScore)
            const score = await LB.getScore(userId);
            const list = await LB.getListBetween();
            expect(result).toBe(0);
            expect(score).toBe(user.score);
            expect(list.length).toBe(1);
        })

        it("update non-existing user's result (Less: create)", async () => {
            const userId = "non-existing-user"
            const newScore = -1000;
            const result = await LB.updateUser(userId, newScore)
            const score = await LB.getScore(userId);
            const list = await LB.getListBetween();
            expect(result).toBe(1);
            expect(score).toBe(newScore);
            expect(list.length).toBe(2);
        })

        it("update existing user's result (Greater: update)", async () => {
            const { userId } = user
            const newScore = 1000;
            const result = await LB.updateUser(userId, newScore)
            const score = await LB.getScore(userId);
            const list = await LB.getListBetween();
            expect(result).toBe(0);
            expect(score).toBe(newScore);
            expect(list.length).toBe(2);
        })

        it("update non-existing user's result (Greater: create)", async () => {
            const userId = "non-existing-user-2"
            const newScore = 1000;
            const result = await LB.updateUser(userId, newScore)
            const score = await LB.getScore(userId);
            const list = await LB.getListBetween();
            expect(result).toBe(1);
            expect(score).toBe(newScore);
            expect(list.length).toBe(3);
        })
    })

    describe('createAndIncrement', () => {
        const user = createUserWithScore();
        const leaderleaderboardId = `leaderboard_test_${clientName}_createAndIncrement`
        const lbOptions: LeaderboardOptions = {
            update: LeaderboardUpdateOptions.createAndIncrement
        }
        const LB = new Leaderboard(client, leaderleaderboardId, lbOptions)

        it("create user", async () => {
            const { userId, score } = user;
            await LBTestMethods(LB).createUser(user)
            await LBTestMethods(LB).getScore(userId, score)
        })

        it("update existing user's result (increment)", async () => {
            const { userId } = user
            const newScore = 1000;
            const result = await LB.updateUser(userId, newScore)
            const score = await LB.getScore(userId);
            const list = await LB.getListBetween();
            const expectedScore = newScore + user.score
            expect(result).toBe('' + expectedScore);
            expect(score).toBe(expectedScore);
            expect(list.length).toBe(1);
        })

        it("update non-existing user's result (create)", async () => {
            const userId = "non-existing-user"
            const newScore = 1000;
            const result = await LB.updateUser(userId, newScore)
            const score = await LB.getScore(userId);
            const list = await LB.getListBetween();
            expect(result).toBe('' + newScore);
            expect(score).toBe(newScore);
            expect(list.length).toBe(2);
        })
    })
})
