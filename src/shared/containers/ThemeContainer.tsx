import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { getThemeHookService } from '../hooks/ThemeHookService';
import { useDIContainer } from '../ui/components/providers/DIProvider';

/**
 * Props for ThemeContainer
 */
export interface IThemeContainerProps extends IBaseComponentProps {
    children: React.ReactNode;
    theme?: string;
    autoDetect?: boolean;
    storageKey?: string;
}

/**
 * State for ThemeContainer
 */
export interface IThemeContainerState extends IBaseComponentState {
    theme: string;
    isDarkMode: boolean;
    systemPreference: string;
}

/**
 * Theme Container - Enterprise theme orchestration component
 * 
 * Provides comprehensive theme management with system detection,
 * persistence, and enterprise-grade error handling.
 */
export class ThemeContainer extends BaseClassComponent<IThemeContainerProps, IThemeContainerState> {
    private themeService = getThemeHookService();
    private diContainer = useDIContainer();
    private mediaQuery: MediaQueryList | null = null;

    protected override getInitialState(): Partial<IThemeContainerState> {
        const { theme, autoDetect = true } = this.props;
        
        // Determine initial theme
        let initialTheme = theme;
        if (!initialTheme && autoDetect) {
            initialTheme = this.getSystemTheme();
        }

        const state = this.themeService.getState();
        
        return {
            theme: initialTheme || state.theme,
            isDarkMode: initialTheme === 'dark' || state.isDarkMode,
            systemPreference: this.getSystemTheme()
        };
    }

    protected override onMount(): void {
        const { storageKey = 'app-theme' } = this.props;
        
        // Set up system theme detection
        this.setupSystemDetection();
        
        // Load persisted theme if available
        this.loadPersistedTheme(storageKey);
        
        // Subscribe to theme service changes
        this.themeService.subscribe((state) => {
            this.safeSetState({
                theme: state.theme,
                isDarkMode: state.isDarkMode
            });
        });

        // Listen for system theme changes
        if (this.mediaQuery) {
            this.mediaQuery.addListener(this.handleSystemThemeChange);
        }
    }

    protected override onUpdate(prevProps: IThemeContainerProps): void {
        const { theme: prevTheme } = prevProps;
        const { theme: currentTheme } = this.props;

        if (prevTheme !== currentTheme && currentTheme !== undefined) {
            this.setTheme(currentTheme);
        }
    }

    protected override onUnmount(): void {
        // Cleanup media query listener
        if (this.mediaQuery) {
            this.mediaQuery.removeListener(this.handleSystemThemeChange);
        }
    }

    private setupSystemDetection(): void {
        if (window.matchMedia) {
            this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        }
    }

    private getSystemTheme(): string {
        if (this.mediaQuery) {
            return this.mediaQuery.matches ? 'dark' : 'light';
        }
        return 'light';
    }

    private handleSystemThemeChange = (): void => {
        const systemTheme = this.getSystemTheme();
        const { autoDetect } = this.props;
        
        if (autoDetect && !this.props.theme) {
            // Auto-switch based on system preference
            this.setTheme(systemTheme);
        }
        
        this.safeSetState({ systemPreference: systemTheme });
    };

    private loadPersistedTheme(storageKey: string): void {
        try {
            const persisted = localStorage.getItem(storageKey);
            if (persisted && ['light', 'dark'].includes(persisted)) {
                this.setTheme(persisted);
            }
        } catch (error) {
            console.error('Failed to load persisted theme:', error);
        }
    };

    private setTheme(theme: string): void {
        const { storageKey = 'app-theme' } = this.props;
        
        // Update theme service
        this.themeService.setThemeMode(theme === 'dark');
        
        // Persist to storage
        try {
            localStorage.setItem(storageKey, theme);
        } catch (error) {
            console.error('Failed to persist theme:', error);
        }
        
        // Update state
        this.safeSetState({
            theme,
            isDarkMode: theme === 'dark'
        });

        // Notify DI container if needed
        const themeService = this.diContainer.get('ThemeService');
        if (themeService && typeof themeService.setTheme === 'function') {
            themeService.setTheme(theme);
        }
    };

    private toggleTheme = (): void => {
        const { isDarkMode } = this.state;
        this.setTheme(isDarkMode ? 'light' : 'dark');
    };

    private resetToSystem = (): void => {
        const { systemPreference } = this.state;
        this.setTheme(systemPreference);
    };

    protected override renderContent(): React.ReactNode {
        const { children } = this.props;
        const { theme, isDarkMode, systemPreference } = this.state;

        return (
            <div className="theme-container" data-theme={theme}>
                <div className="theme-info">
                    <span>Current Theme: {theme}</span>
                    <span>Dark Mode: {isDarkMode ? 'Yes' : 'No'}</span>
                    <span>System Preference: {systemPreference}</span>
                </div>
                <div className="theme-controls">
                    <button onClick={this.toggleTheme}>
                        Toggle Theme
                    </button>
                    <button onClick={this.resetToSystem}>
                        Use System Theme
                    </button>
                </div>
                {children}
            </div>
        );
    }
}

export default ThemeContainer;
