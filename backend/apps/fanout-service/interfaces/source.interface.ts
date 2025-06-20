import { EventEmitter } from 'stream';

export interface ISource {
    get(): Promise<EventEmitter>
}
