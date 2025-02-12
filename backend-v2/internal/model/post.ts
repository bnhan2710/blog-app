import { InferSchemaType, model, Schema } from 'mongoose';

const postSchema = new Schema(

);

type postSchemaInferType = InferSchemaType<typeof postSchema>;

export default model<postSchemaInferType>('posts', postSchema);
