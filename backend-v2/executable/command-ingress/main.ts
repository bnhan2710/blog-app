import {config} from 'dotenv';
import path from 'path';
config({ path: path.join(process.cwd(), '.env') });
import {createHttpServer} from './app';
import mongoose from 'mongoose';
import env from './utils/env';
import { PostChangeStreamSource } from './cdc/source/change-streams.service.ts';
import { RedisSink } from './cdc/sink/redis_sink';
import { Operator, Pipeline } from './cdc/pipeline';
import { connectRedis } from '../../lib/redis';
import { TransformDataOperator } from './cdc/operator/transfrom_data';

async function start() {
    await mongoose.connect(env.MONGO_URI);
    const redisClient = await connectRedis();
    const server = createHttpServer(redisClient);

    const source = new PostChangeStreamSource()
    const sink = new RedisSink(redisClient)
    const operators: Operator[] = []
    operators.push(new TransformDataOperator())
    const pipeline = new Pipeline(source, sink , operators)
    await pipeline.run()

    server.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });

    process.on('SIGINT', () => {
        // redisClient.quit();

        // Avoid connection leak.
        mongoose.connection.close();
        process.exit(0);
    });
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});