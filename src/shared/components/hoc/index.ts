/**
 * HOC Index
 * 
 * Exports all higher-order components with enterprise patterns.
 * Legacy HOCs are marked as deprecated.
 */

// Enterprise HOCs (Preferred)
export {
    EnterpriseWithData,
    clearAllDataCache,
    clearDataCache
} from './EnterpriseWithData';

export {
    EnterpriseWithNavigation
} from './EnterpriseWithNavigation';

export {
    withTheme
} from './withTheme';

// Legacy HOCs (Deprecated)
export {
    withData
} from './withData';

export {
    withErrorBoundary
} from './withErrorBoundary';

export {
    withFileUpload
} from './withFileUpload';

export {
    withLoadingState
} from './withLoadingState';

export {
    withNavigation
} from './withNavigation';

export {
    withQueryData
} from './withQueryData';

// Utility HOCs
export {
    compose
} from './compose';
