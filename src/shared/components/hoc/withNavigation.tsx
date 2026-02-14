import React from 'react';
import { createNavigationHookService } from '../../hooks/NavigationHookService';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../base/BaseClassComponent';

/**
 * Configuration options for withNavigation HOC
 */
export interface IWithNavigationOptions {
    enableRouteGuard?: boolean;
    fallbackPath?: string;
}

/**
 * Props injected by withNavigation HOC
 */
export interface IWithNavigationProps extends IBaseComponentProps {
    navigatePath: (path: string) => void;
}

/**
 * Higher-order component that provides navigation functionality
 * 
 * Uses the existing NavigationHookService to inject navigation capabilities
 * into any component while maintaining enterprise patterns.
 * 
 * @param options - Configuration options for navigation behavior
 * @returns A higher-order component that injects navigation props
 */
export function withNavigation<P extends IBaseComponentProps>(
    options: IWithNavigationOptions = {}
) {
    return (WrappedComponent: React.ComponentType<P & IWithNavigationProps>) => {
        return class WithNavigation extends BaseClassComponent<P, IBaseComponentState> {
            private navigationService = createNavigationHookService();

            protected override onMount(): void {
                // Initialize navigation service
                const utilities = this.navigationService.getNavigationUtilities();
                
                // Apply route guard if enabled
                if (options.enableRouteGuard && options.fallbackPath) {
                    // Basic route guard logic - can be enhanced
                    this.setupRouteGuard(utilities.navigatePath, options.fallbackPath);
                }
            }

            private setupRouteGuard = (navigate: (path: string) => void, fallbackPath: string): void => {
                // Simple route guard implementation
                // Can be enhanced with authentication checks, role-based access, etc.
                const currentPath = window.location.pathname;
                
                // Example: Protect certain routes
                const protectedRoutes = ['/dashboard', '/profile', '/settings'];
                const isProtected = protectedRoutes.some(route => currentPath.startsWith(route));
                
                if (isProtected) {
                    console.warn(`Access denied to protected route: ${currentPath}`);
                    navigate(fallbackPath);
                }
            };

            protected override renderContent(): React.ReactNode {
                const utilities = this.navigationService.getNavigationUtilities();
                const navigationProps: IWithNavigationProps = {
                    navigatePath: utilities.navigatePath
                };

                return <WrappedComponent {...this.props} {...navigationProps} />;
            }
        };
    };
}

export default withNavigation;
