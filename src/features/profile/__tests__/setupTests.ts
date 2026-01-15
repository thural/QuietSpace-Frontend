/**
 * Profile test setup (kept intentionally lightweight).
 *
 * Note: Jest's root config uses a testRegex that treats any TS/TSX file under
 * a __tests__ folder as a test file. So this file must be compile-safe.
 */

// Minimal polyfills used by various UI libs
beforeAll(() => {
  const w = globalThis as any;

  if (!w.ResizeObserver) {
    w.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  if (!w.fetch) {
    w.fetch = async () => ({
      ok: true,
      json: async () => ({})
    });
  }
});

describe('Profile test setup', () => {
  it('loads', () => {
    expect(true).toBe(true);
  });
});
