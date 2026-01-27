import { EnterpriseAuthService } from '@/core/auth';
import { AuthCredentials, AuthResult, AuthSession } from '@/features/auth/data/models/auth';
import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';

/**
 * Auth Services Hook - PHASE 2 MIGRATION
 * 
 * Now provides access to enterprise-grade authentication services
 * from the core auth system, eliminating duplicate feature services.
 */
export const useAuthServices = () => {
  const container = useDIContainer();

  // Get enterprise auth service from DI container
  // Note: This will be configured in the DI container setup
  const enterpriseAuthService = container.get<EnterpriseAuthService>(TYPES.AUTH_SERVICE);

  return {
    // Enterprise authentication service
    enterpriseAuthService,

    // Convenience methods for common operations
    // These provide the same interface as before but use core services
    authenticate: (providerName: string, credentials: AuthCredentials) =>
      enterpriseAuthService.authenticate(providerName, credentials),

    logout: () => enterpriseAuthService.globalSignout(),

    getCurrentSession: () => enterpriseAuthService.getCurrentSession(),

    // Legacy compatibility aliases
    data: enterpriseAuthService, // For backward compatibility
    feature: enterpriseAuthService, // For backward compatibility

    // Direct access to enterprise service
    service: enterpriseAuthService
  };
};
