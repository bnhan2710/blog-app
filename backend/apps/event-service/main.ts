import {config} from 'dotenv';
import path from 'path';
config({ path: path.join(process.cwd(), '.env') });
import mongoose from 'mongoose';
import env from '../command-ingress/utils/env';
import { PostSource } from './sources/post-source';
import { FeedSink } from './sinks/feed.sink';
import { Operator, Pipeline } from './pipelines/post-fanout-pipeline';
import { TransformPostMetadata } from './operators/transfrom-post-metadata';
import { connectRedis } from '../../lib/redis';

async function main() {

    await mongoose.connect(env.MONGO_URI);
    const redisClient = await connectRedis();
    const postSource = new PostSource()
    const feedSink = new FeedSink(redisClient)
    const operators: Operator[] = []
    operators.push(new TransformPostMetadata())
    const postFanoutPipeline = new Pipeline(postSource, feedSink , operators)
    await postFanoutPipeline.run()

    const closeFn = () => {
        console.log('Received OS Signal. Exiting gracefully...');
        redisClient.quit();
        mongoose.connection.close();
        process.exit(0);
    }
    process.on('SIGINT', closeFn);
    process.on('SIGTERM', closeFn);

}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});