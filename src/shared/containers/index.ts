/**
 * Shared Containers Index
 * 
 * Exports all shared containers with enterprise patterns.
 * Legacy containers are marked as deprecated.
 */

// Enterprise Containers (Preferred)
export { 
    ThemeContainer,
    type IThemeContainerProps,
    type IThemeContainerState 
} from './ThemeContainer';

export { 
    EnterpriseFileUploadContainer,
    type IEnterpriseFileUploadContainerProps,
    type IEnterpriseFileUploadContainerState 
} from './EnterpriseFileUploadContainer';

// Legacy Containers (Deprecated)
export { 
    FileUploadContainer,
    type IFileUploadContainerProps,
    type IFileUploadContainerState 
} from './FileUploadContainer';

export { 
    NavigationContainer,
    type INavigationContainerProps,
    type INavigationContainerState 
} from './NavigationContainer';
