import { ISink } from '../interfaces/sink.interface';
import { createClient } from 'redis';

export class FeedSink implements ISink{
    redisClient: ReturnType<typeof createClient>;
    constructor( redisClient: ReturnType<typeof createClient> ) {
        this.redisClient = redisClient;
    }
    async save(data: any): Promise<void> {
       if(data.sinkData.operationType === 'insert') {
           await this.savePost(data)
       }
       else if(data.sinkData.operationType === 'update') {
           await this.updatePost(data)
       }
    }

    async savePost(data: any): Promise<void> {
        const sinkData = data.sinkData
        const post = sinkData.fullDocument
        const { followers } = sinkData
        const score = (new Date(sinkData.fullDocument.createdAt)).getTime()
        const pipeline = this.redisClient.multi();
        for (const follower of followers) {
            pipeline.ZADD(`user:${follower}:following-feeds`, {
                score,
                value: JSON.stringify(post),
            });
        }

        await pipeline.exec();
    }

    async updatePost(data: any): Promise<void> {
        const sinkData = data.sinkData;
        const post = sinkData.fullDocument;
        const { followers } = sinkData;
        const score = new Date(sinkData.fullDocument.createdAt).getTime();
        const pipeline = this.redisClient.multi();
        for (const follower of followers) {
          pipeline.ZREMRANGEBYSCORE(`user:${follower}:following-feeds`, score, score);
          pipeline.ZADD(`user:${follower}:following-feeds`, {
            score,
            value: JSON.stringify(post),
          });
        }
        await pipeline.exec();
      }

}