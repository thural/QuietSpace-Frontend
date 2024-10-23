export type ErrorFunction = (eror: Error, ...args: any[]) => any;
export type ErrorConsumer = (eror: Error, ...args: any[]) => void;
export type AnyFunction = (...args: any[]) => any;
export type ConsumerFn = (...args: any[]) => void;
export type ProducerFn = () => any;
export type ProcedureFn = () => void