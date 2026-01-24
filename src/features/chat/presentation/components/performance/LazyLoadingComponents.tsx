/**
 * Lazy Loading Components
 * 
 * This module provides lazy loading utilities and components for optimizing
 * component loading and improving initial page load performance.
 */

import React, { Suspense, lazy, ComponentType, Component, ReactNode } from 'react';
import BoxStyled from '@shared/BoxStyled';
import Typography from '@shared/Typography';
import { FiLoader, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

// Lazy loading configuration
interface LazyLoadConfig {
    fallback?: ReactNode;
    errorFallback?: ReactNode;
    delay?: number;
    retryDelay?: number;
    maxRetries?: number;
    preload?: boolean;
    rootMargin?: string;
    threshold?: number;
}

// Default configuration
const DEFAULT_CONFIG: LazyLoadConfig = {
    fallback: <DefaultLoadingFallback />,
    errorFallback: <DefaultErrorFallback />,
    delay: 200,
    retryDelay: 1000,
    maxRetries: 3,
    preload: false,
    rootMargin: '50px',
    threshold: 0.1
};

/**
 * Default loading fallback component
 */
const DefaultLoadingFallback: React.FC = () => (
    <BoxStyled className=\"flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200\">
        <div className=\"flex flex-col items-center space-y-3\">
            <FiLoader className=\"text-3xl text-blue-600 animate-spin\" />
            <Typography className=\"text-gray-600\">Loading component...</Typography>
        </div>
    </BoxStyled>
);

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC = () => (
    <BoxStyled className=\"flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200\">
        <div className=\"flex flex-col items-center space-y-3\">
            <FiAlertTriangle className=\"text-3xl text-red-600\" />
            <Typography className=\"text-red-700\">Failed to load component</Typography>
            <button
                onClick={() => window.location.reload()}
                className=\"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center space-x-2\"
            >
                <FiRefreshCw />
                <span>Retry</span>
            </button>
        </div>
    </BoxStyled>
);

/**
 * Error boundary for lazy loaded components
 */
interface LazyErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    retryCount: number;
}

class LazyErrorBoundary extends Component<
    { children: ReactNode; fallback?: ReactNode; maxRetries?: number },
    LazyErrorBoundaryState
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, retryCount: 0 };
    }

    static getDerivedStateFromError(error: Error): LazyErrorBoundaryState {
        return { hasError: true, error, retryCount: 0 };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Lazy loading error:', error, errorInfo);
    }

    handleRetry = () => {
        const { maxRetries = 3 } = this.props;
        if (this.state.retryCount < maxRetries) {
            this.setState(prev => ({
                hasError: false,
                error: undefined,
                retryCount: prev.retryCount + 1
            }));
        }
    };

    render() {
        if (this.state.hasError) {
            return this.props.fallback || <DefaultErrorFallback />;
        }

        return this.props.children;
    }
}

/**
 * Lazy loading wrapper component
 */
interface LazyLoadWrapperProps {
    children: ReactNode;
    config?: LazyLoadConfig;
    className?: string;
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({ 
    children, 
    config = DEFAULT_CONFIG,
    className = ''
}) => {
    const { maxRetries } = config;

    return (
        <LazyErrorBoundary 
            fallback={config.errorFallback} 
            maxRetries={maxRetries}
        >
            <Suspense fallback={config.fallback}>
                <div className={className}>
                    {children}
                </div>
            </Suspense>
        </LazyErrorBoundary>
    );
};

/**
 * Higher-order component for lazy loading
 */
export function withLazyLoad<P extends object>(
    importFunc: () => Promise<{ default: ComponentType<P> }>,
    config: LazyLoadConfig = {}
) {
    const LazyComponent = lazy(importFunc);
    
    return React.forwardRef<any, P>((props, ref) => (
        <LazyLoadWrapper config={config}>
            <LazyComponent {...props} ref={ref} />
        </LazyLoadWrapper>
    ));
}

/**
 * Create a lazy loaded component with custom configuration
 */
export function createLazyComponent<T extends ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    config: LazyLoadConfig = {}
) {
    return lazy(importFunc, {
        suspense: (
            <LazyLoadWrapper config={config}>
                {config.fallback || <DefaultLoadingFallback />}
            </LazyLoadWrapper>
        )
    });
}

/**
 * Intersection Observer Hook for lazy loading
 */
export function useIntersectionObserver(
    ref: React.RefObject<Element>,
    options: IntersectionObserverInit = {}
) {
    const [isIntersecting, setIsIntersecting] = React.useState(false);

    React.useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [ref, options]);

    return isIntersecting;
}

/**
 * Lazy loading hook with intersection observer
 */
export function useLazyLoad(
    shouldLoad: boolean,
    loadFunc: () => Promise<void>,
    options: IntersectionObserverInit = {}
) {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const load = React.useCallback(async () => {
        if (isLoaded || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            await loadFunc();
            setIsLoaded(true);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }, [shouldLoad, isLoaded, isLoading, loadFunc]);

    React.useEffect(() => {
        if (shouldLoad && !isLoaded && !isLoading) {
            load();
        }
    }, [shouldLoad, isLoaded, isLoading, load]);

    return { isLoaded, isLoading, error, load };
}

/**
 * Lazy loading component with intersection observer
 */
interface LazyLoadOnScrollProps {
    children: ReactNode;
    fallback?: ReactNode;
    rootMargin?: string;
    threshold?: number;
    className?: string;
}

export const LazyLoadOnScroll: React.FC<LazyLoadOnScrollProps> = ({
    children,
    fallback = <DefaultLoadingFallback />,
    rootMargin = '50px',
    threshold = 0.1,
    className = ''
}) => {
    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);
    const [isIntersecting, setIsIntersecting] = React.useState(false);
    const [shouldLoad, setShouldLoad] = React.useState(false);

    // Intersection observer
    React.useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                }
            },
            { rootMargin, threshold }
        );

        observer.observe(ref);

        return () => {
            observer.unobserve(ref);
        };
    }, [ref, rootMargin, threshold]);

    return (
        <div ref={setRef} className={className}>
            {shouldLoad ? (
                <Suspense fallback={fallback}>
                    {children}
                </Suspense>
            ) : (
                fallback
            )}
        </div>
    );
};

/**
 * Preload component utility
 */
export function preloadComponent(importFunc: () => Promise<{ default: any }>) {
    // Start loading the component in the background
    importFunc();
}

/**
 * Batch preload multiple components
 */
export function preloadComponents(importFuncs: Array<() => Promise<{ default: any }>>) {
    importFuncs.forEach(importFunc => {
        // Start loading each component with a small delay to avoid overwhelming the network
        setTimeout(importFunc, Math.random() * 1000);
    });
}

/**
 * Lazy loading with retry mechanism
 */
interface LazyLoadWithRetryProps {
    children: ReactNode;
    importFunc: () => Promise<{ default: any }>;
    maxRetries?: number;
    retryDelay?: number;
    fallback?: ReactNode;
    errorFallback?: ReactNode;
}

export const LazyLoadWithRetry: React.FC<LazyLoadWithRetryProps> = ({
    children,
    importFunc,
    maxRetries = 3,
    retryDelay = 1000,
    fallback = <DefaultLoadingFallback />,
    errorFallback = <DefaultErrorFallback />
}) => {
    const [retryCount, setRetryCount] = React.useState(0);
    const [error, setError] = React.useState<Error | null>(null);

    const LazyComponent = React.useMemo(() => {
        return lazy(() => {
            return importFunc().catch(err => {
                setError(err instanceof Error ? err : new Error('Import failed'));
                throw err;
            });
        });
    }, [importFunc]);

    const handleRetry = () => {
        if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
            // Force re-import by creating a new lazy component
            window.location.reload();
        }
    };

    React.useEffect(() => {
        if (error && retryCount < maxRetries) {
            const timer = setTimeout(() => {
                handleRetry();
            }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff

            return () => clearTimeout(timer);
        }
    }, [error, retryCount, maxRetries, retryDelay]);

    if (error) {
        return (
            <BoxStyled className=\"flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200\">
            <FiAlertTriangle className=\"text-3xl text-red-600 mb-3\" />
            <Typography className=\"text-red-700 mb-3\">Failed to load component</Typography>
            <Typography className=\"text-sm text-gray-600 mb-4\">{error.message}</Typography>
            <Typography className=\"text-sm text-gray-500 mb-4\">Retry {retryCount} of {maxRetries}</Typography>
            <button
                onClick={handleRetry}
                className=\"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center space-x-2\"
            >
                <FiRefreshCw className={retryCount > 0 ? 'animate-spin' : ''} />
                <span>Retry</span>
            </button>
        </BoxStyled>
    );
    }

    return (
        <Suspense fallback={fallback}>
            <LazyComponent />
        </Suspense>
    );
};

/**
 * Performance monitoring for lazy loading
 */
export function useLazyLoadPerformance() {
    const [metrics, setMetrics] = React.useState({
        loadTime: 0,
        componentCount: 0,
        successCount: 0,
        errorCount: 0,
        averageLoadTime: 0
    });

    const recordLoadStart = React.useCallback((componentName: string) => {
        const startTime = performance.now();
        return () => {
            const loadTime = performance.now() - startTime;
            
            setMetrics(prev => ({
                ...prev,
                loadTime,
                componentCount: prev.componentCount + 1,
                successCount: prev.successCount + 1,
                averageLoadTime: ((prev.averageLoadTime * prev.successCount) + loadTime) / (prev.successCount + 1)
            }));

            console.log(`Lazy load ${componentName}: ${loadTime.toFixed(2)}ms`);
        };
    }, []);

    const recordError = React.useCallback((componentName: string, error: Error) => {
        setMetrics(prev => ({
            ...prev,
            componentCount: prev.componentCount + 1,
            errorCount: prev.errorCount + 1
        }));

        console.error(`Lazy load error ${componentName}:`, error);
    }, []);

    return {
        metrics,
        recordLoadStart,
        recordError
    };
}

/**
 * Lazy loading configuration provider
 */
interface LazyLoadConfigContextType {
    config: LazyLoadConfig;
    updateConfig: (config: Partial<LazyLoadConfig>) => void;
}

const LazyLoadConfigContext = React.createContext<LazyLoadConfigContextType | null>(null);

export const LazyLoadConfigProvider: React.FC<{
    children: ReactNode;
    config?: Partial<LazyLoadConfig>;
}> = ({ children, config: userConfig = {} }) => {
    const [config, setConfig] = React.useState<LazyLoadConfig>({
        ...DEFAULT_CONFIG,
        ...userConfig
    });

    const updateConfig = React.useCallback((newConfig: Partial<LazyLoadConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    return (
        <LazyLoadConfigContext.Provider value={{ config, updateConfig }}>
            {children}
        </LazyLoadConfigContext.Provider>
    );
};

export const useLazyLoadConfig = () => {
    const context = React.useContext(LazyLoadConfigContext);
    if (!context) {
        throw new Error('useLazyLoadConfig must be used within LazyLoadConfigProvider');
    }
    return context;
};

/**
 * Utility function to create lazy loaded components with consistent configuration
 */
export function createLazyComponentFactory(defaultConfig: Partial<LazyLoadConfig> = {}) {
    return {
        create: <T extends ComponentType<any>>(
            importFunc: () => Promise<{ default: T }>,
            config: Partial<LazyLoadConfig> = {}
        ) => {
            const finalConfig = { ...DEFAULT_CONFIG, ...defaultConfig, ...config };
            return createLazyComponent(importFunc, finalConfig);
        },
        
        withHOC: <P extends object>(
            importFunc: () => Promise<{ default: ComponentType<P> }>,
            config: Partial<LazyLoadConfig> = {}
        ) => {
            const finalConfig = { ...DEFAULT_CONFIG, ...defaultConfig, ...config };
            return withLazyLoad(importFunc, finalConfig);
        }
    };
}

// Export commonly used lazy loading patterns
export const LazyLoadingPatterns = {
    // For heavy components
    heavy: {
        fallback: <DefaultLoadingFallback />,
        delay: 500,
        rootMargin: '100px'
    },
    
    // For critical components
    critical: {
        fallback: <DefaultLoadingFallback />,
        delay: 100,
        rootMargin: '25px',
        preload: true
    },
    
    // For non-critical components
    nonCritical: {
        fallback: <DefaultLoadingFallback />,
        delay: 1000,
        rootMargin: '200px'
    },
    
    // For image components
    image: {
        fallback: <DefaultLoadingFallback />,
        delay: 300,
        rootMargin: '50px'
    }
};

export default {
    LazyLoadWrapper,
    withLazyLoad,
    createLazyComponent,
    LazyLoadOnScroll,
    LazyLoadWithRetry,
    LazyLoadConfigProvider,
    useLazyLoadConfig,
    createLazyComponentFactory,
    LazyLoadingPatterns,
    preloadComponent,
    preloadComponents,
    useIntersectionObserver,
    useLazyLoad,
    useLazyLoadPerformance
};
