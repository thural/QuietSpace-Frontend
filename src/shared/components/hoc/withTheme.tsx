import React from 'react';
import { getThemeHookService } from '../../hooks/ThemeHookService';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../base/BaseClassComponent';

/**
 * Configuration options for withTheme HOC
 */
export interface IWithThemeOptions {
    persistToStorage?: boolean;
    validateTheme?: boolean;
    fallbackTheme?: string;
}

/**
 * Props injected by withTheme HOC
 */
export interface IWithThemeProps extends IBaseComponentProps {
    theme: any;
    setThemeMode: (isChecked: boolean) => void;
    isDarkMode: boolean;
    setLocalThemeMode: (isChecked: boolean) => void;
}

/**
 * Higher-order component that provides theme functionality
 * 
 * Uses the existing ThemeHookService to inject theme capabilities
 * into any component while maintaining enterprise patterns.
 * 
 * @param options - Configuration options for theme behavior
 * @returns A higher-order component that injects theme props
 */
export function withTheme<P extends IBaseComponentProps>(
    options: IWithThemeOptions = {}
) {
    return (WrappedComponent: React.ComponentType<P & IWithThemeProps>) => {
        return class WithTheme extends BaseClassComponent<P, IBaseComponentState> {
            private themeService = getThemeHookService();

            protected override onMount(): void {
                const state = this.themeService.getState();

                // Apply basic theme validation if enabled
                if (options.validateTheme && state.theme) {
                    const validThemes = ['light', 'dark', 'auto'];
                    if (!validThemes.includes(state.theme)) {
                        console.warn(`Invalid theme: ${state.theme}`);
                        if (options.fallbackTheme) {
                            this.themeService.setThemeMode(options.fallbackTheme === 'dark');
                        }
                    }
                }
            }

            private handleSetTheme = (isChecked: boolean): void => {
                if (options.validateTheme) {
                    const targetTheme = isChecked ? 'dark' : 'light';
                    const validThemes = ['light', 'dark', 'auto'];
                    if (!validThemes.includes(targetTheme)) {
                        console.warn(`Invalid theme: ${targetTheme}`);
                        if (options.fallbackTheme) {
                            this.themeService.setThemeMode(options.fallbackTheme === 'dark');
                        }
                        return;
                    }
                }

                this.themeService.setThemeMode(isChecked);

                // Persist to storage if enabled
                if (options.persistToStorage) {
                    try {
                        localStorage.setItem('theme-mode', isChecked ? 'dark' : 'light');
                    } catch (error) {
                        console.error('Failed to persist theme:', error);
                    }
                }
            };

            protected override renderContent(): React.ReactNode {
                const state = this.themeService.getState();
                const themeProps: IWithThemeProps = {
                    theme: state.theme,
                    setThemeMode: this.handleSetTheme,
                    isDarkMode: state.isDarkMode,
                    setLocalThemeMode: require('../../../utils/localStorageUtils').setLocalThemeMode
                };

                return <WrappedComponent {...this.props} {...themeProps} />;
            }
        };
    };
}

export default withTheme;
