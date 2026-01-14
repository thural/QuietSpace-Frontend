// Minimal mock shim for stompjs used in tests
export const over = () => ({
    connect: () => { },
});

export const Frame = {};

export class Client {
    connect() { }
    disconnect() { }
    send() { }
    subscribe() { return { unsubscribe: () => { } }; }
    unsubscribe() { }
}

export default { over, Frame, Client };
