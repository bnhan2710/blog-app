import { ISource } from '../interfaces/source.interface';
import Post from '../../../internal/models/post';
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