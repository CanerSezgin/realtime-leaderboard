import { Leaderboard } from "../../lib/Leaderboard"
import { userId } from "../../lib/types"

type User = { userId: userId, score: number }

export const LBTestMethods = (LB: Leaderboard) => {
    return {
        createUser: async (user: User) => {
            const result = await LB.createUser(user.userId, user.score)
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

            expect(list[0].rank).toBe(startRank);
            expect(list[list.length - 1].rank).toBe(endRank);

            list.forEach((player, index) => {
                expect(player).toEqual(expect.objectContaining(expectedList[index]))
            });

            return list
        }
    }
}

export const getSortedList = (users: User[]) => JSON.parse(JSON.stringify(users)).sort((a: User, b: User) => b.score - a.score)

export const getIndexOfUser = (users: User[], userId: userId) => {
    const sortedList = getSortedList(users);
    return sortedList.findIndex((user: User) => user.userId === userId) + 1
}

export const getUsersBetween = (users: User[], start: number, end: number) => {
    const sortedList = getSortedList(users);
    return sortedList.slice(start - 1, end);
}