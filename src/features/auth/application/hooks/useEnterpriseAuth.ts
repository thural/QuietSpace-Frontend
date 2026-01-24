import { useService } from '@core/di';
import { TYPES } from '@core/di/types';

/**
 * Hook for accessing the enterprise authentication service
 * from the dependency injection container.
 */
export function useEnterpriseAuth() {
    return useService(TYPES.AUTH_SERVICE);
}

export default useEnterpriseAuth;
