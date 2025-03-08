import { Sink } from '../sink';
import { createClient } from 'redis';

export class RedisSink implements Sink{
    redisClient: ReturnType<typeof createClient>;
    constructor( redisClient: ReturnType<typeof createClient> ) {
        this.redisClient = redisClient;
    }
    async save(data: any): Promise<void> {
        const sinkData = data.sinkData
        const post = sinkData.fullDocument
        const { followers } = sinkData
        const score = (new Date(sinkData.fullDocument.createdAt)).getTime()
        const pipeline = this.redisClient.multi();
        for (const follower of followers) {
            pipeline.ZADD(`user:${follower}:feed`, {
                score,
                value: JSON.stringify(post),
            });
        }
        await pipeline.exec();
    }
}