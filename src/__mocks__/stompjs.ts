export const over = jest.fn();

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
    connect = (jest.fn() as jest.MockedFunction<() => void>);
    send = (jest.fn() as jest.MockedFunction<() => void>);
    subscribe = (jest.fn() as jest.MockedFunction<() => void>);
    disconnect = (jest.fn() as jest.MockedFunction<() => void>);
}