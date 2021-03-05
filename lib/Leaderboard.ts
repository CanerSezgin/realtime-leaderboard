import CustomRedisClient from "./CustomRedisClient"
import { userId, UserInLeaderboard } from "./types"

export enum _LeaderboardUpdateOptions {
  updateOnly = "XX",
  createOnly = "NX",
  createAndUpdateIfLess = "LT",
  createAndUpdateIfGrater = "GT",
  createAndIncrement = "INCR"
}

export enum LeaderboardUpdateOptions {
  updateOnly = "updateOnly",
  createOnly = "createOnly",
  createAndUpdateIfLess = "createAndUpdateIfLess",
  createAndUpdateIfGrater = "createAndUpdateIfGrater",
  createAndIncrement = "createAndIncrement"
}

export type LeaderboardOptions = {
  update: LeaderboardUpdateOptions
}
export default class Leaderboard {
  private client;
  public clientType;
  constructor(redisClient: any, public boardId: string, private opts: LeaderboardOptions) {
    this.client = redisClient instanceof CustomRedisClient ?
      redisClient :
      new CustomRedisClient(redisClient)
    this.clientType = this.client.type;
  }

  private static getUpdateOption(optionInput: LeaderboardUpdateOptions) {
    const defaultOpts = _LeaderboardUpdateOptions.createOnly;
    return _LeaderboardUpdateOptions[optionInput] || defaultOpts;
  }

  async createUser(userId: userId, score: number) {
    const updateOption = Leaderboard.getUpdateOption(LeaderboardUpdateOptions.createOnly);
    return this.client.zadd(this.boardId, updateOption, score, userId)
  }
  async updateUser(userId: userId, score: number)  {
    const updateOption = Leaderboard.getUpdateOption(this.opts.update)
    return this.client.zadd(this.boardId, updateOption, score, userId)
  }
  async getScore(userId: userId) {
    const score = await this.client.zscore(this.boardId, userId)
    return score ? parseFloat(score) : null
  }
  async getRank(userId: userId) {
    const rank = await this.client.zrevrank(this.boardId, userId);
    return rank + 1;
  }
  async getListBetween(startRank: number = 1, endRank: number = 0) {
    const result = await this.client.zrevrange(
      this.boardId,
      startRank - 1,
      endRank - 1,
      "WITHSCORES"
    );
    return Leaderboard.zrevrangeResponse(result, startRank);
  }
  private static zrevrangeResponse(rangeResponse: string[], startRank: number): UserInLeaderboard[] {
    const response = [];
    const userIds = rangeResponse.filter((el, index) => index % 2 === 0);
    const scores = rangeResponse.filter((el, index) => index % 2 === 1);

    for (let i: number = 0; i < userIds.length; i++) {
      response.push({
        userId: userIds[i],
        score: parseFloat(scores[i]),
        rank: startRank + i,
      });
    }
    return response;
  }
}