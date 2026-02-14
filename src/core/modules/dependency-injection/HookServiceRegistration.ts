/**
 * Hook Service Registration
 * 
 * Registers all HookServices in the DI container for better integration
 * with existing enterprise infrastructure.
 */

import { getThemeHookService } from '../../../shared/hooks/ThemeHookService';
import { createFileUploadHookService } from '../../../shared/hooks/FileUploadHookService';
import { createComponentHeightHookService } from '../../../shared/hooks/ComponentHeightHookService';
import { createComponentInitialHeightHookService } from '../../../shared/hooks/ComponentInitialHeightHookService';
import { createPlaceholderCountHookService } from '../../../shared/hooks/PlaceholderCountHookService';
import { createNavigationHookService } from '../../../shared/hooks/NavigationHookService';
import { createFormInputHookService } from '../../../shared/hooks/FormInputHookService';
import { createHoverStateHookService } from '../../../shared/hooks/HoverStateHookService';
import { createMultiSelectHookService } from '../../../shared/hooks/MultiSelectHookService';
import { createSearchQueryHookService } from '../../../shared/hooks/SearchQueryHookService';
import { createTokenRefreshHookService } from '../../../shared/hooks/TokenRefreshHookService';

/**
 * Register all HookServices in the provided DI container
 * 
 * @param container - The DI container to register services in
 */
export function registerHookServices(container: any): void {
    console.log('🔗 Registering HookServices in DI container...');

    // Theme Hook Service
    const themeHookService = getThemeHookService();
    container.registerInstance('THEME_HOOK_SERVICE', themeHookService);
    console.log('✅ THEME_HOOK_SERVICE registered');

    // File Upload Hook Service
    const fileUploadHookService = createFileUploadHookService({ 
        fetchCallback: async () => ({}) // Default callback
    });
    container.registerInstance('FILE_UPLOAD_HOOK_SERVICE', fileUploadHookService);
    console.log('✅ FILE_UPLOAD_HOOK_SERVICE registered');

    // Component Height Hook Service
    const componentHeightHookService = createComponentHeightHookService({ 
        ref: { current: null } 
    });
    container.registerInstance('COMPONENT_HEIGHT_HOOK_SERVICE', componentHeightHookService);
    console.log('✅ COMPONENT_HEIGHT_HOOK_SERVICE registered');

    // Component Initial Height Hook Service
    const componentInitialHeightHookService = createComponentInitialHeightHookService({ 
        component: null as any 
    });
    container.registerInstance('COMPONENT_INITIAL_HEIGHT_HOOK_SERVICE', componentInitialHeightHookService);
    console.log('✅ COMPONENT_INITIAL_HEIGHT_HOOK_SERVICE registered');

    // Placeholder Count Hook Service
    const placeholderCountHookService = createPlaceholderCountHookService({ 
        placeholderHeight: 50 
    });
    container.registerInstance('PLACEHOLDER_COUNT_HOOK_SERVICE', placeholderCountHookService);
    console.log('✅ PLACEHOLDER_COUNT_HOOK_SERVICE registered');

    // Navigation Hook Service
    const navigationHookService = createNavigationHookService();
    container.registerInstance('NAVIGATION_HOOK_SERVICE', navigationHookService);
    console.log('✅ NAVIGATION_HOOK_SERVICE registered');

    // Form Input Hook Service
    const formInputHookService = createFormInputHookService({ 
        initialValue: '', 
        options: { preventDefault: true } 
    });
    container.registerInstance('FORM_INPUT_HOOK_SERVICE', formInputHookService);
    console.log('✅ FORM_INPUT_HOOK_SERVICE registered');

    // Hover State Hook Service
    const hoverStateHookService = createHoverStateHookService();
    container.registerInstance('HOVER_STATE_HOOK_SERVICE', hoverStateHookService);
    console.log('✅ HOVER_STATE_HOOK_SERVICE registered');

    // Multi Select Hook Service
    const multiSelectHookService = createMultiSelectHookService({ 
        items: [], 
        options: {} 
    });
    container.registerInstance('MULTI_SELECT_HOOK_SERVICE', multiSelectHookService);
    console.log('✅ MULTI_SELECT_HOOK_SERVICE registered');

    // Search Query Hook Service
    const searchQueryHookService = createSearchQueryHookService({ 
        initialQuery: '', 
        debounceMs: 300 
    });
    container.registerInstance('SEARCH_QUERY_HOOK_SERVICE', searchQueryHookService);
    console.log('✅ SEARCH_QUERY_HOOK_SERVICE registered');

    // Token Refresh Hook Service
    const tokenRefreshHookService = createTokenRefreshHookService({ 
        refreshToken: '', 
        accessToken: '' 
    });
    container.registerInstance('TOKEN_REFRESH_HOOK_SERVICE', tokenRefreshHookService);
    console.log('✅ TOKEN_REFRESH_HOOK_SERVICE registered');

    console.log('🎉 All HookServices registered successfully!');
}

/**
 * Get a specific hook service from the container
 * 
 * @param container - The DI container
 * @param serviceName - The name of the service to retrieve
 * @returns The requested hook service
 */
export function getHookService<T>(container: any, serviceName: string): T {
    const service = container.get(serviceName);
    if (!service) {
        throw new Error(`Hook service '${serviceName}' not found in DI container`);
    }
    return service;
}

/**
 * Check if a hook service is registered
 * 
 * @param container - The DI container
 * @param serviceName - The name of the service to check
 * @returns True if service is registered
 */
export function hasHookService(container: any, serviceName: string): boolean {
    return container.has(serviceName);
}

/**
 * Get all registered hook service names
 * 
 * @param container - The DI container
 * @returns Array of registered hook service names
 */
export function getRegisteredHookServices(container: any): string[] {
    return [
        'THEME_HOOK_SERVICE',
        'FILE_UPLOAD_HOOK_SERVICE',
        'COMPONENT_HEIGHT_HOOK_SERVICE',
        'COMPONENT_INITIAL_HEIGHT_HOOK_SERVICE',
        'PLACEHOLDER_COUNT_HOOK_SERVICE',
        'NAVIGATION_HOOK_SERVICE',
        'FORM_INPUT_HOOK_SERVICE',
        'HOVER_STATE_HOOK_SERVICE',
        'MULTI_SELECT_HOOK_SERVICE',
        'SEARCH_QUERY_HOOK_SERVICE',
        'TOKEN_REFRESH_HOOK_SERVICE'
    ].filter(serviceName => container.has(serviceName));
}
