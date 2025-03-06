import { Sink } from '../sink';
import { createClient } from 'redis';

export class RedisSink implements Sink{
    redisClient: ReturnType<typeof createClient>;
    constructor( redisClient: ReturnType<typeof createClient> ) {
        this.redisClient = redisClient;
    }
    async save(data: any): Promise<void> {
        const sinkData = data.sinkData
        const postId = String(sinkData.fullDocument._id)
        const { followers } = sinkData
        const score = (new Date(sinkData.fullDocument.createdAt)).getTime()
        const pipeline = this.redisClient.multi();
        for (const follower of followers) {
            pipeline.ZADD(`user:${follower}:feed`, {
                score,
                value: postId,
            });
        }
        await pipeline.exec();
    }
}