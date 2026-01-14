// Lightweight mock implementation compatible with ESM and Jest environments
function createMockFn() {
    const fn: any = (...args: any[]) => {
        fn.mock.calls.push(args);
        if (typeof fn._impl === 'function') return fn._impl(...args);
    };
    fn.mock = { calls: [] };
    fn._isMockFunction = true;
    fn.mockImplementation = (impl: (...a: any[]) => any) => { fn._impl = impl; };
    fn.mockClear = () => { fn.mock.calls.length = 0; };
    return fn;
}

export const over = createMockFn();

export class Frame {
    constructor(
        public command: string,
        public headers: any = {},
        public body: string = ''
    ) { }

    toString() {
        return `${this.command}: ${this.body}`;
    }
}

export class Client {
    connected = true;
    connect = createMockFn();
    send = createMockFn();
    subscribe = createMockFn();
    disconnect = createMockFn();
}