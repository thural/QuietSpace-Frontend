import { Container } from '@/core/di/container/Container';
import { TYPES } from '@/core/di/types';
import { EnterpriseAuthService } from '@/core/auth';
import { ICacheProvider } from '@/core/cache';
import { IAuthRepository } from '../../domain/entities/IAuthRepository';
import { AuthRepository } from '../../data/repositories/AuthRepository';

/**
 * Auth Feature DI Container - PHASE 2 MIGRATION
 * 
 * Now configures dependency injection using enterprise-grade services
 * from the core auth system, eliminating duplicate feature services.
 * 
 * Enterprise Pattern:
 * - EnterpriseAuthService: Singleton (centralized auth logic)
 * - Repositories: Transient scope (stateless data access)
 * - Cache Provider: Singleton (shared across features)
 */

export function createAuthContainer(): Container {
  const container = new Container();

  // Enterprise Auth Service (Singleton - centralized authentication)
  // Note: This should be configured with proper dependencies from core auth
  // For now, we'll register it and let the main container configure dependencies
  container.registerSingletonByToken(
    TYPES.AUTH_SERVICE,
    EnterpriseAuthService
  );

  // Legacy repository support (will be removed in Phase 3)
  container.registerTransientByToken(
    TYPES.IAUTH_REPOSITORY,
    AuthRepository
  );

  return container;
}

/**
 * Child container configuration
 * Creates a child container that inherits from the main AppContainer
 */
export function createAuthChildContainer(parentContainer: Container): Container {
  const authContainer = parentContainer.createChild();

  // Register enterprise auth service
  authContainer.registerSingletonByToken(
    TYPES.AUTH_SERVICE,
    EnterpriseAuthService
  );

  // Legacy repository support (will be removed in Phase 3)
  authContainer.registerTransientByToken(
    TYPES.IAUTH_REPOSITORY,
    AuthRepository
  );

  return authContainer;
}

/**
 * Container factory for testing
 */
export function createTestAuthContainer(): Container {
  const container = new Container();

  // Mock EnterpriseAuthService for testing
  container.registerSingletonByToken(
    TYPES.AUTH_SERVICE,
    EnterpriseAuthService // Replace with mock in tests
  );

  // Mock repository for testing
  container.registerTransientByToken(
    TYPES.IAUTH_REPOSITORY,
    AuthRepository // Replace with mock in tests
  );

  return container;
}
