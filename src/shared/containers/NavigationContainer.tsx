import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { createNavigationHookService } from '../hooks/NavigationHookService';
import { useDIContainer } from '../ui/components/providers/DIProvider';

/**
 * Props for NavigationContainer
 */
export interface INavigationContainerProps extends IBaseComponentProps {
    children: React.ReactNode;
    basePath?: string;
    enableHistory?: boolean;
    maxHistoryLength?: number;
    routes?: Array<{
        path: string;
        name: string;
        protected?: boolean;
        roles?: string[];
    }>;
}

/**
 * State for NavigationContainer
 */
export interface INavigationContainerState extends IBaseComponentState {
    currentPath: string;
    previousPath: string | null;
    history: string[];
    canGoBack: boolean;
    canGoForward: boolean;
}

/**
 * Navigation Container - Enterprise navigation orchestration component
 * 
 * Provides comprehensive navigation management with history tracking,
 * route protection, and enterprise-grade features.
 */
export class NavigationContainer extends BaseClassComponent<INavigationContainerProps, INavigationContainerState> {
    private navigationService = createNavigationHookService();
    private diContainer = useDIContainer();

    protected override getInitialState(): Partial<INavigationContainerState> {
        return {
            currentPath: window.location.pathname,
            previousPath: null,
            history: [],
            canGoBack: false,
            canGoForward: false
        };
    }

    protected override onMount(): void {
        const { enableHistory = true, maxHistoryLength = 50 } = this.props;
        
        // Initialize navigation service
        this.navigationService = createNavigationHookService();
        
        // Subscribe to navigation service changes
        const utilities = this.navigationService.getNavigationUtilities();
        
        // Set up history tracking
        if (enableHistory) {
            this.setupHistoryTracking(maxHistoryLength);
        }

        // Set up route protection
        this.setupRouteProtection();

        // Listen for browser navigation events
        window.addEventListener('popstate', this.handlePopState);
    }

    protected override onUpdate(prevProps: INavigationContainerProps): void {
        const { routes: prevRoutes } = prevProps;
        const { routes: currentRoutes } = this.props;

        if (prevRoutes !== currentRoutes) {
            this.setupRouteProtection();
        }
    }

    protected override onUnmount(): void {
        // Cleanup event listeners
        window.removeEventListener('popstate', this.handlePopState);
    }

    private setupHistoryTracking = (maxLength: number): void => {
        // Track navigation history for back/forward functionality
        this.safeSetState({
            history: this.getInitialHistory()
        });
    };

    private getInitialHistory = (): string[] => {
        const currentPath = window.location.pathname;
        const stored = localStorage.getItem('navigation-history');
        
        if (stored) {
            try {
                const history = JSON.parse(stored);
                // Ensure current path is at the end
                const filtered = history.filter((path: string) => path !== currentPath);
                return [...filtered, currentPath].slice(-maxLength);
            } catch (error) {
                console.error('Failed to parse navigation history:', error);
            }
        }
        
        return [currentPath];
    };

    private setupRouteProtection = (): void => {
        const { routes } = this.props;
        if (!routes) return;

        const currentPath = window.location.pathname;
        const currentRoute = routes.find(route => this.pathMatchesRoute(currentPath, route.path));
        
        if (currentRoute) {
            // Check route protection
            if (currentRoute.protected) {
                const authService = this.diContainer.get('AuthService');
                if (authService) {
                    const isAuthenticated = authService.isAuthenticated?.() || false;
                    const user = authService.getUser?.() || null;
                    
                    // Check role-based access
                    if (currentRoute.roles && currentRoute.roles.length > 0) {
                        const hasRequiredRole = user && currentRoute.roles.some(role => 
                            user.roles?.includes(role) || user.role === role
                        );
                        
                        if (!hasRequiredRole) {
                            this.handleUnauthorizedAccess(currentRoute);
                            return;
                        }
                    }
                    
                    if (!isAuthenticated) {
                        this.handleUnauthorizedAccess(currentRoute);
                        return;
                    }
                }
            }
        }

        this.safeSetState({
            currentPath,
            canGoBack: this.state.history.length > 1,
            canGoForward: false // Will be updated based on history
        });
    };

    private pathMatchesRoute = (path: string, routePath: string): boolean => {
        // Simple path matching - can be enhanced with regex
        if (routePath.includes(':')) {
            const routeParts = routePath.split('/');
            const pathParts = path.split('/');
            
            return routeParts.every((part, index) => {
                if (part.startsWith(':')) {
                    return pathParts[index] !== undefined;
                }
                return part === pathParts[index];
            });
        }
        
        return path === routePath || path.startsWith(routePath + '/');
    };

    private handleUnauthorizedAccess = (route: any): void => {
        console.warn(`Unauthorized access to route: ${route.path}`);
        
        // Redirect to login or show access denied
        const loginPath = '/login';
        if (window.location.pathname !== loginPath) {
            this.navigate(loginPath);
        }
    };

    private handlePopState = (event: PopStateEvent): void => {
        const newPath = event.state?.path || window.location.pathname;
        this.updateNavigationState(newPath);
    };

    private updateNavigationState = (newPath: string): void => {
        const { previousPath, history, maxHistoryLength = 50 } = this.props;
        
        let newHistory = [...history];
        
        // Add to history if different from current
        if (newPath !== this.state.currentPath) {
            newHistory.push(newPath);
            
            // Limit history length
            if (newHistory.length > maxHistoryLength) {
                newHistory = newHistory.slice(-maxHistoryLength);
            }
            
            // Update back/forward capability
            const currentIndex = newHistory.indexOf(newPath);
            this.safeSetState({
                currentPath: newPath,
                previousPath: this.state.currentPath,
                history: newHistory,
                canGoBack: currentIndex > 0,
                canGoForward: currentIndex < newHistory.length - 1
            });
        }

        // Persist history
        try {
            localStorage.setItem('navigation-history', JSON.stringify(newHistory));
        } catch (error) {
            console.error('Failed to save navigation history:', error);
        }
    };

    private navigate = (path: string): void => {
        const utilities = this.navigationService.getNavigationUtilities();
        utilities.navigatePath(path);
        this.updateNavigationState(path);
    };

    private goBack = (): void => {
        const { history } = this.state;
        const { canGoBack } = this.state;
        
        if (canGoBack && history.length > 1) {
            const currentIndex = history.indexOf(this.state.currentPath);
            if (currentIndex > 0) {
                const previousPath = history[currentIndex - 1];
                this.navigate(previousPath);
            }
        }
    };

    private goForward = (): void => {
        const { history } = this.state;
        const { canGoForward } = this.state;
        
        if (canGoForward && history.length > 1) {
            const currentIndex = history.indexOf(this.state.currentPath);
            if (currentIndex < history.length - 1) {
                const nextPath = history[currentIndex + 1];
                this.navigate(nextPath);
            }
        }
    };

    protected override renderContent(): React.ReactNode {
        const { children } = this.props;
        const { currentPath, previousPath, history, canGoBack, canGoForward } = this.state;

        return (
            <div className="navigation-container">
                <div className="navigation-info">
                    <div className="current-path">Current: {currentPath}</div>
                    <div className="previous-path">Previous: {previousPath || 'None'}</div>
                    <div className="history-length">History: {history.length} items</div>
                </div>
                
                <div className="navigation-controls">
                    <button 
                        onClick={() => this.goBack()}
                        disabled={!canGoBack}
                        className="nav-button back-button"
                    >
                        ← Back
                    </button>
                    
                    <button 
                        onClick={() => this.goForward()}
                        disabled={!canGoForward}
                        className="nav-button forward-button"
                    >
                        Forward →
                    </button>
                </div>

                <div className="breadcrumb">
                    {this.generateBreadcrumb(currentPath)}
                </div>

                {children}
            </div>
        );
    }

    private generateBreadcrumb = (path: string): React.ReactNode => {
        const parts = path.split('/').filter(part => part);
        
        return (
            <nav className="breadcrumb">
                <span onClick={() => this.navigate('/')} className="breadcrumb-item">
                    Home
                </span>
                {parts.map((part, index) => {
                    const fullPath = '/' + parts.slice(0, index + 1).join('/');
                    return (
                        <React.Fragment key={fullPath}>
                            <span className="breadcrumb-separator"> / </span>
                            <span 
                                onClick={() => this.navigate(fullPath)}
                                className="breadcrumb-item"
                            >
                                {part}
                            </span>
                        </React.Fragment>
                    );
                })}
            </nav>
        );
    };
}

export default NavigationContainer;
