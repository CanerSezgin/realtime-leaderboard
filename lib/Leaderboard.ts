import { promisify } from "util"

type LeaderboardOptions = {}

export default class Leaderboard {
    private client: CustomRedisClient
    constructor(private redisClient: any, public boardId: string, private opts: LeaderboardOptions) {
        this.client = new CustomRedisClient(redisClient)
    }

    hi(){
        console.log(this.client)
    }

}