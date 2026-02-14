/**
 * Enterprise Navigation HOC
 * 
 * Enterprise-grade higher-order component for navigation management.
 * Uses enterprise patterns with proper history management and state tracking.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../base/BaseClassComponent';
import { createNavigationManagementService, type INavigationManagementService, type INavigationState } from '../../services/NavigationManagementService';

/**
 * Configuration options for EnterpriseWithNavigation HOC
 */
export interface IEnterpriseWithNavigationOptions {
    initialPath?: string;
    maxHistorySize?: number;
    enableBrowserSync?: boolean;
    interceptNavigation?: boolean;
}

/**
 * Props injected by EnterpriseWithNavigation HOC
 */
export interface IEnterpriseWithNavigationProps extends IBaseComponentProps {
    navigation: INavigationState;
    navigateTo: (path: string) => void;
    goBack: () => void;
    goForward: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
    clearHistory: () => void;
}

/**
 * State for EnterpriseWithNavigation HOC
 */
interface IEnterpriseWithNavigationState extends IBaseComponentState {
    navigation: INavigationState;
}

/**
 * EnterpriseWithNavigation - Enterprise navigation HOC
 * 
 * Provides enterprise-grade navigation management with history tracking,
 * browser synchronization, and proper state management.
 */
export function EnterpriseWithNavigation(
    options: IEnterpriseWithNavigationOptions = {}
) {
    return (WrappedComponent: React.ComponentType<any>) => {
        return class EnterpriseWithNavigation extends BaseClassComponent<any, IEnterpriseWithNavigationState> {
            private navigationService: INavigationManagementService;

            constructor(props: any) {
                super(props);
                this.navigationService = createNavigationManagementService(options.initialPath);
            }

            protected override getInitialState(): Partial<IEnterpriseWithNavigationState> {
                return {
                    navigation: this.navigationService.getCurrentState()
                };
            }

            protected override onMount(): void {
                // Subscribe to navigation service changes
                this.navigationService.subscribe((navigationState) => {
                    this.safeSetState({
                        navigation: navigationState
                    });
                });
            }

            protected override onUnmount(): void {
                // Cleanup navigation service
                this.navigationService.destroy();
            }

            /**
             * Handle navigation
             */
            private handleNavigateTo = (path: string): void => {
                this.navigationService.navigateTo(path);
            };

            /**
             * Handle go back
             */
            private handleGoBack = (): void => {
                this.navigationService.goBack();
            };

            /**
             * Handle go forward
             */
            private handleGoForward = (): void => {
                this.navigationService.goForward();
            };

            /**
             * Check if can go back
             */
            private handleCanGoBack = (): boolean => {
                return this.navigationService.canGoBack();
            };

            /**
             * Check if can go forward
             */
            private handleCanGoForward = (): boolean => {
                return this.navigationService.canGoForward();
            };

            /**
             * Clear navigation history
             */
            private handleClearHistory = (): void => {
                // Create new service instance to clear history
                this.navigationService.destroy();
                this.navigationService = createNavigationManagementService(options.initialPath);
                
                this.safeSetState({
                    navigation: this.navigationService.getCurrentState()
                });
            };

            /**
             * Get current path
             */
            private getCurrentPath = (): string => {
                return this.state.navigation.currentPath;
            };

            /**
             * Get navigation history
             */
            private getNavigationHistory = (): string[] => {
                return this.state.navigation.navigationHistory;
            };

            /**
             * Check if currently navigating
             */
            private isNavigating = (): boolean => {
                return this.state.navigation.isNavigating;
            };

            /**
             * Get previous path
             */
            private getPreviousPath = (): string | null => {
                return this.state.navigation.previousPath;
            };

            protected override renderContent(): React.ReactNode {
                const { navigation } = this.state;
                
                const injectedProps: IEnterpriseWithNavigationProps = {
                    navigation,
                    navigateTo: this.handleNavigateTo,
                    goBack: this.handleGoBack,
                    goForward: this.handleGoForward,
                    canGoBack: this.handleCanGoBack(),
                    canGoForward: this.handleCanGoForward(),
                    clearHistory: this.handleClearHistory
                };

                return <WrappedComponent {...this.props} {...injectedProps} />;
            }
        };
    };
}

export default EnterpriseWithNavigation;
