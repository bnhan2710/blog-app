import {ISink} from './sink';
import {ISource} from './source';

type Transformer = (data: any) => Promise<any>;

interface Operator {
    run: (data: any) => Promise<any>;
}

class Pipeline {
    source: ISource;
    sink: ISink;
    operators: Operator[];

    constructor(source: ISource, sink: ISink, operators: Operator[]) {
        this.source = source;
        this.sink = sink;
        this.operators = operators;
    }

    async run() {
        const eventEmitter = await this.source.get();

        eventEmitter.on('change', async (data) => {
            console.log('[Pipeline] Received data:', data);

            for (const operator of this.operators) {
                data = await operator.run(data);
                console.log('Transformed', data);
            }

            console.log('[Pipeline] Transformed data:', data);
            await this.sink.save(data);
        });
    }
}

export {
    Pipeline,
    Transformer,
    Operator,
};