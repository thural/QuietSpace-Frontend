/**
 * Shared Services Index
 * 
 * Exports all shared services with enterprise patterns.
 * Legacy services are marked as deprecated.
 */

// Enterprise Services (Preferred)
export {
    EnterpriseThemeService,
    getEnterpriseThemeService,
    createEnterpriseThemeService,
    type IEnterpriseThemeService
} from './EnterpriseThemeService';

export {
    ThemeManagementService,
    getThemeManagementService,
    createThemeManagementService,
    type IThemeManagementService
} from './ThemeManagementService';

export {
    FileUploadManagementService,
    createFileUploadManagementService,
    type IFileUploadManagementService,
    type IUploadState,
    type FetchCallback
} from './FileUploadManagementService';

export {
    NavigationManagementService,
    createNavigationManagementService,
    type INavigationManagementService,
    type INavigationState
} from './NavigationManagementService';

export {
    ComponentHeightManagementService,
    createComponentHeightManagementService,
    type IComponentHeightManagementService,
    type IComponentHeightState
} from './ComponentHeightManagementService';

// Legacy Services (Deprecated)
export {
    getThemeService,
    createThemeService,
    useThemeService,
    type IThemeService
} from './ThemeService';

export { default as ComponentHeightService } from './ComponentHeightService';
export { default as ComponentInitialHeightService } from './ComponentInitialHeightService';
export { default as ErrorBoundaryService } from './ErrorBoundaryService';
export { default as FileUploadService } from './FileUploadService';
export { default as NavigationService } from './NavigationService';
export { default as NotificationUtilsService } from './NotificationUtilsService';
export { default as PlaceholderCountService } from './PlaceholderCountService';
