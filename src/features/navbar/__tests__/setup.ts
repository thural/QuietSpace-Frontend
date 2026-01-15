/**
 * Test setup for navbar feature tests.
 * 
 * This file sets up the testing environment for navbar tests
 * including global mocks and test utilities.
 */

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => {
      return Object.keys(store)[index] || null;
    })
  };
})();

// Mock performance API
const performanceMock = {
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1024 * 1024 // 1MB
  }
};

// Set up global mocks
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(window, 'performance', {
  value: performanceMock
});

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  configurable: true
});

// Mock StorageEvent
global.StorageEvent = class MockStorageEvent extends Event {
  constructor(type: string, eventInitDict: any) {
    super(type, eventInitDict);
    Object.assign(this, eventInitDict);
  }
} as any;

// Test utilities
export const createMockNotificationData = (overrides: any = {}) => ({
  hasPendingNotification: overrides.hasPendingNotification ?? false,
  hasUnreadChat: overrides.hasUnreadChat ?? false,
  isLoading: overrides.isLoading ?? false
});

export const createMockNavigationItems = (overrides: any = {}) => ({
  mainItems: overrides.mainItems ?? [
    {
      linkTo: '/feed',
      pathName: '/feed',
      icons: { icon: 'PiHouse', iconFill: 'PiHouseFill' }
    },
    {
      linkTo: '/search',
      pathName: '/search',
      icons: { icon: 'PiMagnifyingGlass', iconFill: 'PiMagnifyingGlassFill' }
    }
  ],
  chat: overrides.chat ?? {
    linkTo: '/chat',
    pathName: '/chat',
    icons: { icon: 'PiChatCircle', iconFill: 'PiChatCircleFill' }
  },
  profile: overrides.profile ?? {
    linkTo: '/profile',
    pathName: '/profile',
    icons: { icon: 'PiUser', iconFill: 'PiUserFill' }
  },
  notification: overrides.notification ?? {
    linkTo: '/notifications',
    pathName: '/notifications',
    icons: { icon: 'PiBell', iconFill: 'PiBellFill' }
  }
});

export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

// Reset all mocks before each test
beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllTimers();
  performanceMock.now.mockReturnValue(Date.now());
});

// Cleanup after each test
afterEach(() => {
  localStorageMock.clear();
  jest.clearAllTimers();
});
