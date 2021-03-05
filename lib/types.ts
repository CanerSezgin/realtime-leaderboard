export type userId = string | number;
export type UserInLeaderboard = {
    userId: userId;
    score: number;
    rank: number;
}
export class User {
    constructor(public userId: userId, public score: number = 0) { }
}