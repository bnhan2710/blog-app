export interface IOperator {
    run: (data: any) => Promise<any>;
}
