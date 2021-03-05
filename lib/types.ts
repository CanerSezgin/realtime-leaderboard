export type LeaderboardOptions = {}
export type userId = string | number;
export class User {
    constructor(public userId: userId, public score: number = 0) { }
}