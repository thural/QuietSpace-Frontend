// Lightweight ESM mock for `sockjs-client` that behaves like a jest mock function
function createMockSockJS() {
    let impl = (url) => ({
        url,
        readyState: 1,
        close: () => { },
        send: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
    });

    const fn = (...args) => {
        fn.mock.calls.push(args);
        return impl(...args);
    };

    fn.mock = { calls: [] };
    fn._isMockFunction = true; // so Jest recognizes it as a mock
    fn.mockImplementation = (newImpl) => { impl = newImpl; };
    fn.mockClear = () => { fn.mock.calls.length = 0; };

    return fn;
}

const mock = createMockSockJS();
export default mock;
