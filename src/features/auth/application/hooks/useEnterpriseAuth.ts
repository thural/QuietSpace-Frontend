import { useService } from '@core/di';
import EnterpriseAuthService from '@core/auth/enterprise/AuthService';

/**
 * Hook for accessing the enterprise authentication service
 * from the dependency injection container.
 */
export function useEnterpriseAuth(): EnterpriseAuthService {
    return useService(EnterpriseAuthService);
}

export default useEnterpriseAuth;
