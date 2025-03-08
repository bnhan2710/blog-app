import { Operator } from '../pipeline'
import UserModel from '../../../../internal/model/user'
import _ from 'lodash'
export class ExtractFollower implements Operator{
   async run(data: any) : Promise<any>{
            if(data.operationType === 'insert'){
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
    }
}
