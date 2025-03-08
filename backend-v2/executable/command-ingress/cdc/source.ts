import { EventEmitter } from 'stream';

export interface Source {
    get(): Promise<EventEmitter>
}
