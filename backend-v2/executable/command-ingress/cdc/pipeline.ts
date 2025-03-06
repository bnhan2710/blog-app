import {Sink} from './sink';
import {Source} from './source';

export type Transformer = (data: any) => Promise<any>;

export interface Operator {
    run: (data: any) => Promise<any>;
}

export class Pipeline {
    source: Source;
    sink: Sink;
    operators: Operator[];

    constructor(source: Source, sink: Sink, operators: Operator[]) {
        this.source = source;
        this.sink = sink;
        this.operators = operators;
    }

    async run() {
        const eventEmitter = await this.source.get();

        eventEmitter.on('change', async (data) => {
            console.log('received data:', data);

            for (const operator of this.operators) {
                data = await operator.run(data);
            }

            console.log('before sink data:', data);
            await this.sink.save(data);
        });
    }
}