// Lightweight ESM mock for `sockjs-client` that behaves like a jest mock function
function createMockSockJS() {
    let impl = (...args: any[]) => ({
        url: args[0],
        readyState: 1,
        close: () => { },
        send: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
    });

    const fn = (...args: any[]) => {
        (fn.mock.calls as any[][]).push(args);
        return impl(...args);
    };

    fn.mock = { calls: [] as any[][] };
    fn._isMockFunction = true; // so Jest recognizes it as a mock
    fn.mockImplementation = (newImpl: any) => { impl = newImpl; };
    fn.mockClear = () => { (fn.mock.calls as any[][]).length = 0; };

    return fn;
}

const mock = createMockSockJS();
export default mock;
