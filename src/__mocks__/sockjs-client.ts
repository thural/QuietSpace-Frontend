export default class SockJS {
  constructor(url: string) {
    return {
      close: (jest.fn() as jest.MockedFunction<() => void>),
      url
    };
  }
}