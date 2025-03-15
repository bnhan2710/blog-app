import { ISource } from '../source';
import Post from '../../../internal/model/post';
import EventEmitter from 'events';

export class PostSource implements ISource{
    async get() : Promise<EventEmitter> {
        const eventEmitter = new EventEmitter()
        Post.watch()
        .on('change', (data:any) => {
            eventEmitter.emit('change', data);
        })
        return eventEmitter
    }
}

