import React from 'react';
import { getEnterpriseThemeService } from '../../services/EnterpriseThemeService';
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
            private themeService = getEnterpriseThemeService();

            protected override onMount(): void {
                const currentTheme = this.themeService.getCurrentTheme();
                const isDarkMode = this.themeService.getIsDarkMode();

                // Apply basic theme validation if enabled
                if (options.validateTheme && currentTheme) {
                    const validThemes = ['light', 'dark', 'auto'];
                    const themeVariant = isDarkMode ? 'dark' : 'light';
                    if (!validThemes.includes(themeVariant)) {
                        console.warn(`Invalid theme: ${themeVariant}`);
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
                const currentTheme = this.themeService.getCurrentTheme();
                const isDarkMode = this.themeService.getIsDarkMode();

                const themeProps: IWithThemeProps = {
                    theme: currentTheme,
                    setThemeMode: this.handleSetTheme,
                    isDarkMode: isDarkMode,
                    setLocalThemeMode: require('../../../utils/localStorageUtils').setLocalThemeMode
                };

                return <WrappedComponent {...this.props} {...themeProps} />;
            }
        };
    };
}

export default withTheme;
