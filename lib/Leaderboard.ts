import CustomRedisClient from "./CustomRedisClient"
import { LeaderboardOptions, userId } from "./types"
export default class Leaderboard {
  private client;
  public clientType;
  constructor(redisClient: any, public boardId: string, private opts: LeaderboardOptions) {
    this.client = redisClient instanceof CustomRedisClient ?
      redisClient :
      new CustomRedisClient(redisClient)
    this.clientType = this.client.type;
  }

  async addUser(userId: userId, score: number) {
    return this.client.zadd(this.boardId, score, userId)
  }
  async getScore(userId: userId) {
    const score = await this.client.zscore(this.boardId, userId)
    return parseFloat(score)
  }
  async getRank(userId: userId) {
    return this.client.zrevrank(this.boardId, userId);
  }
  async getBetween(startRank: number = 0, endRank: number = -1) {
    const result = await this.client.zrevrange(
      this.boardId,
      startRank,
      endRank - 1,
      "WITHSCORES"
    );
    return this.zrevrangeResponse(result, startRank);
  }
  private zrevrangeResponse(rangeResponse: string[], startRank: number) {
    const response = [];
    const userIds = rangeResponse.filter((el, index) => index % 2 === 0);
    const scores = rangeResponse.filter((el, index) => index % 2 === 1);

    for (let i = 0; i < userIds.length; i++) {
      response.push({
        userId: userIds[i],
        score: parseFloat(scores[i]),
        rank: startRank + i,
      });
    }
    return response;
  }
}