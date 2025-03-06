import { Operator } from '../pipeline'
import UserModel from '../../../../internal/model/user'
import _ from 'lodash'
export class ExtractFollower implements Operator{
   async run(data: any) : Promise<any>{
        if(!this.isNew){
            return
        }
        const authorId = _.get(data, 'fullDocument.author');
        const author = await UserModel.findById(authorId)
        const followers = _.get(author, 'followers', []).map((follower) => String(follower));
        return {
            sinkData: {
                ...data,
                followers
            }
        }
}


    isNew(data: any) : boolean{
       return data.operationType === 'insert'
    }



}
