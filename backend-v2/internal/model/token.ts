import {InferSchemaType, model, Schema} from 'mongoose';

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
});

type tokenSchemaInferType = InferSchemaType<typeof tokenSchema>;
export default model<tokenSchemaInferType>('tokens', tokenSchema);
