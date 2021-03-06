import { CustomRedisClient } from "./CustomRedisClient"
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

export type LeaderboardUpdateOptionsType = "updateOnly" | "createOnly" | "createAndUpdateIfLess" |
  "createAndUpdateIfGrater" | "createAndIncrement"

export type LeaderboardOptions = {
  update: LeaderboardUpdateOptionsType
}

/**
 * Leaderboard Class
 */
export class Leaderboard {
  private client;
  public clientType;
  /**
   * Leaderboard class constructor
   * 
   * @param redisClient - redisClient >>> Supports
   * 
   * Redis {@link https://www.npmjs.com/package/redis}
   * 
   * ioRedis {@link https://www.npmjs.com/package/ioredis}
   * 
   * @param leaderboardId - Leaderboard Identifier
   * @param opts - Leaderboard Options 
   */
  constructor(redisClient: any, public leaderboardId: string, private opts: LeaderboardOptions) {
    this.client = redisClient instanceof CustomRedisClient ?
      redisClient :
      new CustomRedisClient(redisClient)
    this.clientType = this.client.type;
  }

  private static getUpdateOption(optionInput: LeaderboardUpdateOptionsType) {
    const defaultOpts = _LeaderboardUpdateOptions.updateOnly;
    return _LeaderboardUpdateOptions[optionInput] || defaultOpts;
  }

  // TODO: async resetLB() {}

  // TODO: async getNoOfUsers() {}

  /**
   * Create User in Leaderboard
   * 
   * @param userId - Unique User Identifier (ex: userId, username, email)
   * @param score - User's Score/Point
   */
  async createUser(userId: string | number, score: number): Promise<0 | 1> {
    const updateOption = Leaderboard.getUpdateOption(LeaderboardUpdateOptions.createOnly);
    return this.client.zadd(this.leaderboardId, updateOption, score, userId)
  }

  /**
   * Update/Upsert User Record. According to LeaderboardUpdateOption selection. 
   * 
   * "updateOnly" : Never allows you to create new records if user doesn't exist.
   * 
   * "createOnly" : Never allows you to update any user score.
   * 
   * "createAndUpdateIfLess" : If user not exist, creates records, otherwise updates if new score 
   * is less than current one.
   * 
   * "createAndUpdateIfGrater" : If user not exist, creates records, otherwise updates if new score 
   * is greater than current one.
   * 
   * "createAndIncrement" : If user not exist, creates records, otherwise adds up new score.
   * 
   * @param userId - Unique User Identifier (ex: userId, username, email)
   * @param score - User's Score/Point
   */
  async updateUser(userId: string | number, score: number) {
    const updateOption = Leaderboard.getUpdateOption(this.opts.update)
    return this.client.zadd(this.leaderboardId, updateOption, score, userId)
  }

  /**
   * Get User's Score by user identifier.
   * 
   * @param userId - Unique User Identifier (ex: userId, username, email)
   */
  async getScore(userId: number | string): Promise<number | null> {
    const score = await this.client.zscore(this.leaderboardId, userId)
    return score == null || score === undefined ? null : parseFloat(score);
  }

  /**
   * Get User's Rank by user identifier. Min: 1
   * 
   * @param userId - Unique User Identifier (ex: userId, username, email)
   */
  async getRank(userId: number | string): Promise<number | null> {
    const rank = await this.client.zrevrank(this.leaderboardId, userId);
    return rank == null || rank === undefined ? null : rank + 1;
  }

  /**
   * It returns users between startRank [included] & endRank [included]
   * 
   * Default: Returns whole leaderboard.
   * 
   * @param startRank - Min: 1
   * @param endRank 
   */
  async getListBetween(startRank: number = 1, endRank: number = 0): Promise<{ userId: number | string, score: number, rank: number }[]> {
    const result = await this.client.zrevrange(
      this.leaderboardId,
      startRank - 1,
      endRank - 1,
      "WITHSCORES"
    );
    console.log({result})
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