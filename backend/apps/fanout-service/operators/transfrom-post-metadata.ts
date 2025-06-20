import { IOperator } from '../interfaces'
import UserModel from '../../../internal/models/user'
import PostModel from '../../../internal/models/post'
import _ from 'lodash'
export class TransformPostMetadata implements IOperator{

    async run(data: any) : Promise<any>{
        if(data.operationType === 'insert'){
            return this.insertCase(data)
        }else if(data.operationType === 'update'){
            return this.updateCase(data)
        }
    }

    async insertCase(data: any) : Promise<any>{
        const authorId = _.get(data, 'fullDocument.author');
        const author = await UserModel.findById(authorId).select('name avatar followers');
        if(!author){
            return
        }
        data.fullDocument.author = author
        const followers = _.get(author, 'followers', []).map((follower) => String(follower));
        return {
            sinkData: {
                ...data,
                followers
            }
        }
    }

    async updateCase(data: any) : Promise<any>{
        const newPost = await PostModel.findById(data.documentKey._id).populate('author');
        if(!newPost){
            return
        }
        data.fullDocument = newPost
        const followers = _.get(newPost, 'author.followers', []).map((follower) => String(follower));

        return {
            sinkData: {
                ...data,
                followers
            }
        }
    }

}
