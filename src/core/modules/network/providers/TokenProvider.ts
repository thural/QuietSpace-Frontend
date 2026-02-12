/**
 * Token Provider for DI-based Authentication
 *
 * DEPRECATED: This file uses legacy store access patterns.
 * Use DI-based authentication from @/core/hooks/ui/dependency-injection instead.
 * 
 * This file will be removed in next major version.
 * Please migrate to useDIContainer and useService hooks.
 */

import type { ITokenProvider } from '../interfaces';

// This entire implementation is deprecated
// Migration: use useService(IAuthService) from @/core/hooks/ui/dependency-injection

// Stub implementation to maintain type safety
export class DeprecatedTokenProvider implements ITokenProvider {
  /**
   * @deprecated Use DI-based authentication instead
   */
  getToken(): string | null {
    console.warn('TokenProvider is deprecated. Use useService(IAuthService) from @/core/hooks/ui/dependency-injection');
    return null;
  }

  /**
   * @deprecated Use DI-based authentication instead
   */
  setToken(token: string): void {
    console.warn('TokenProvider is deprecated. Use useService(IAuthService) from @/core/hooks/ui/dependency-injection');
  }

  /**
   * @deprecated Use DI-based authentication instead
   */
  clearToken(): void {
    console.warn('TokenProvider is deprecated. Use useService(IAuthService) from @/core/hooks/ui/dependency-injection');
  }

  /**
   * @deprecated Use DI-based authentication instead
   */
  async refreshToken(): Promise<string> {
    console.warn('TokenProvider is deprecated. Use useService(IAuthService) from @/core/hooks/ui/dependency-injection');
    throw new Error('TokenProvider is deprecated. Migrate to DI-based authentication');
  }
}

// Maintain backward compatibility with existing exports
export const TokenProvider = DeprecatedTokenProvider;
