/**
 * Mobile Enhancer
 * 
 * This component provides mobile-specific optimizations including touch gestures,
 * responsive design enhancements, and mobile UX improvements.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
    FiSmartphone, 
    FiTablet, 
    FiMonitor, 
    FiTouchApp, 
    FiMove, 
    FiZoomIn, 
    FiZoomOut,
    FiRotateCw,
    FiNavigation,
    FiSettings,
    FiMaximize,
    FiMinimize,
    FiChevronLeft,
    FiChevronRight,
    FiHome,
    FiArrowUp
} from 'react-icons/fi';

export interface MobileConfig {
    enableTouchGestures: boolean;
    enableSwipeNavigation: boolean;
    enablePinchToZoom: boolean;
    enablePullToRefresh: boolean;
    enableHapticFeedback: boolean;
    enableMobileOptimizations: boolean;
    enableAdaptiveLayout: boolean;
    enableMobileKeyboard: boolean;
    enableTouchOptimization: boolean;
    gestureSensitivity: 'low' | 'medium' | 'high';
    swipeThreshold: number;
    pinchThreshold: number;
    longPressThreshold: number;
}

export interface TouchGesture {
    id: string;
    type: 'swipe' | 'pinch' | 'longPress' | 'doubleTap' | 'rotate' | 'pan';
    direction?: 'left' | 'right' | 'up' | 'down';
    fingers?: number;
    threshold: number;
    action: (event: TouchEvent) => void;
    enabled: boolean;
    element?: string;
}

export interface MobileViewport {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
    deviceType: 'mobile' | 'tablet' | 'desktop';
    pixelRatio: number;
    isTouchDevice: boolean;
}

export interface MobileOptimization {
    enableVirtualScrolling: boolean;
    enableLazyLoading: boolean;
    enableImageOptimization: boolean;
    enableFontOptimization: boolean;
    enableNetworkOptimization: boolean;
    enableBatteryOptimization: boolean;
}

export interface SwipeNavigation {
    enabled: boolean;
    leftAction?: () => void;
    rightAction?: () => void;
    upAction?: () => void;
    downAction?: () => void;
    threshold: number;
    preventDefault: boolean;
}

interface MobileEnhancerContextType {
    config: MobileConfig;
    viewport: MobileViewport;
    optimizations: MobileOptimization;
    gestures: TouchGesture[];
    isMobile: boolean;
    isTablet: boolean;
    isTouchDevice: boolean;
    
    // Actions
    toggleTouchGestures: () => void;
    toggleSwipeNavigation: () => void;
    togglePinchToZoom: () => void;
    togglePullToRefresh: () => void;
    addGesture: (gesture: TouchGesture) => void;
    removeGesture: (id: string) => void;
    enableGesture: (id: string, enabled: boolean) => void;
    setSwipeNavigation: (navigation: SwipeNavigation) => void;
    optimizeForMobile: () => void;
    detectDeviceType: () => MobileViewport;
    enableHapticFeedback: (type: 'light' | 'medium' | 'heavy') => void;
    vibrate: (pattern: number[]) => void;
    scrollToTop: () => void;
    toggleFullscreen: () => void;
    setAdaptiveLayout: () => void;
    getTouchPosition: (event: TouchEvent) => { x: number; y: number };
}

const MobileEnhancerContext = createContext<MobileEnhancerContextType | null>(null);

// Mobile Enhancer Provider
interface MobileEnhancerProviderProps {
    children: React.ReactNode;
    config?: Partial<MobileConfig>;
}

export const MobileEnhancerProvider: React.FC<MobileEnhancerProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config, setConfig] = useState<MobileConfig>({
        enableTouchGestures: true,
        enableSwipeNavigation: true,
        enablePinchToZoom: true,
        enablePullToRefresh: true,
        enableHapticFeedback: true,
        enableMobileOptimizations: true,
        enableAdaptiveLayout: true,
        enableMobileKeyboard: true,
        enableTouchOptimization: true,
        gestureSensitivity: 'medium',
        swipeThreshold: 50,
        pinchThreshold: 10,
        longPressThreshold: 500,
        ...userConfig
    });

    const [viewport, setViewport] = useState<MobileViewport>({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        deviceType: getDeviceType(),
        pixelRatio: window.devicePixelRatio || 1,
        isTouchDevice: 'ontouchstart' in window
    });

    const [optimizations, setOptimizations] = useState<MobileOptimization>({
        enableVirtualScrolling: true,
        enableLazyLoading: true,
        enableImageOptimization: true,
        enableFontOptimization: true,
        enableNetworkOptimization: true,
        enableBatteryOptimization: true
    });

    const [gestures, setGestures] = useState<TouchGesture[]>([]);
    const [swipeNavigation, setSwipeNavigation] = useState<SwipeNavigation>({
        enabled: true,
        threshold: 50,
        preventDefault: true
    });

    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Detect device type
    function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
        const width = window.innerWidth;
        const isTouch = 'ontouchstart' in window;
        
        if (width <= 768 && isTouch) return 'mobile';
        if (width <= 1024 && isTouch) return 'tablet';
        return 'desktop';
    }

    // Update viewport information
    const updateViewport = useCallback(() => {
        const newViewport: MobileViewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
            deviceType: getDeviceType(),
            pixelRatio: window.devicePixelRatio || 1,
            isTouchDevice: 'ontouchstart' in window
        };
        
        setViewport(newViewport);
        
        // Apply adaptive layout if enabled
        if (config.enableAdaptiveLayout) {
            applyAdaptiveLayout(newViewport);
        }
    }, [config.enableAdaptiveLayout]);

    // Apply adaptive layout based on viewport
    const applyAdaptiveLayout = useCallback((viewportInfo: MobileViewport) => {
        const root = document.documentElement;
        
        // Set CSS custom properties for responsive design
        root.style.setProperty('--viewport-width', `${viewportInfo.width}px`);
        root.style.setProperty('--viewport-height', `${viewportInfo.height}px`);
        root.style.setProperty('--device-type', viewportInfo.deviceType);
        root.style.setProperty('--orientation', viewportInfo.orientation);
        
        // Add device-specific classes
        document.body.classList.remove('mobile', 'tablet', 'desktop');
        document.body.classList.add(viewportInfo.deviceType);
        
        // Add orientation class
        document.body.classList.remove('portrait', 'landscape');
        document.body.classList.add(viewportInfo.orientation);
        
        // Adjust font sizes for mobile
        if (viewportInfo.deviceType === 'mobile') {
            root.style.setProperty('--base-font-size', '16px');
        } else if (viewportInfo.deviceType === 'tablet') {
            root.style.setProperty('--base-font-size', '18px');
        } else {
            root.style.setProperty('--base-font-size', '14px');
        }
    }, []);

    // Handle touch start
    const handleTouchStart = useCallback((event: TouchEvent) => {
        if (!config.enableTouchGestures || !config.enableTouchOptimization) return;
        
        const touch = event.touches[0];
        touchStartRef.current = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };
        
        // Start long press timer
        if (config.enableHapticFeedback) {
            longPressTimerRef.current = setTimeout(() => {
                enableHapticFeedback('medium');
                triggerGesture('longPress', event);
            }, config.longPressThreshold);
        }
        
        // Handle pinch start
        if (event.touches.length === 2 && config.enablePinchToZoom) {
            const distance = getDistance(event.touches[0], event.touches[1]);
            pinchStartRef.current = { distance, scale: 1 };
        }
    }, [config]);

    // Handle touch move
    const handleTouchMove = useCallback((event: TouchEvent) => {
        if (!config.enableTouchGestures || !touchStartRef.current) return;
        
        const touch = event.touches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        
        // Clear long press timer on move
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
        
        // Handle pinch zoom
        if (event.touches.length === 2 && config.enablePinchToZoom && pinchStartRef.current) {
            const currentDistance = getDistance(event.touches[0], event.touches[1]);
            const scale = currentDistance / pinchStartRef.current.distance;
            
            if (Math.abs(scale - 1) > config.pinchThreshold / 100) {
                triggerGesture('pinch', event, { scale });
                enableHapticFeedback('light');
            }
        }
        
        // Handle swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > config.swipeThreshold) {
            const direction = deltaX > 0 ? 'right' : 'left';
            triggerGesture('swipe', event, { direction, deltaX });
        }
    }, [config]);

    // Handle touch end
    const handleTouchEnd = useCallback((event: TouchEvent) => {
        if (!config.enableTouchGestures || !touchStartRef.current) return;
        
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        const deltaTime = Date.now() - touchStartRef.current.time;
        
        // Clear long press timer
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
        
        // Detect double tap
        if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
            triggerGesture('doubleTap', event);
            enableHapticFeedback('light');
        }
        
        // Handle swipe navigation
        if (config.enableSwipeNavigation && swipeNavigation.enabled) {
            if (Math.abs(deltaX) > swipeNavigation.threshold) {
                const direction = deltaX > 0 ? 'right' : 'left';
                
                if (direction === 'left' && swipeNavigation.leftAction) {
                    swipeNavigation.leftAction();
                    enableHapticFeedback('medium');
                } else if (direction === 'right' && swipeNavigation.rightAction) {
                    swipeNavigation.rightAction();
                    enableHapticFeedback('medium');
                }
            }
        }
        
        touchStartRef.current = null;
        pinchStartRef.current = null;
    }, [config, swipeNavigation]);

    // Get distance between two touch points
    const getDistance = (touch1: Touch, touch2: Touch): number => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Trigger gesture
    const triggerGesture = useCallback((type: string, event: TouchEvent, data?: any) => {
        const matchingGestures = gestures.filter(gesture => 
            gesture.enabled && gesture.type === type
        );
        
        matchingGestures.forEach(gesture => {
            // Check element selector if specified
            if (gesture.element) {
                const target = event.target as HTMLElement;
                if (!target.closest(gesture.element)) return;
            }
            
            gesture.action(event);
        });
    }, [gestures]);

    // Toggle touch gestures
    const toggleTouchGestures = useCallback((): void => {
        setConfig(prev => ({ ...prev, enableTouchGestures: !prev.enableTouchGestures }));
    }, []);

    // Toggle swipe navigation
    const toggleSwipeNavigation = useCallback((): void => {
        setConfig(prev => ({ ...prev, enableSwipeNavigation: !prev.enableSwipeNavigation }));
        setSwipeNavigation(prev => ({ ...prev, enabled: !prev.enabled }));
    }, []);

    // Toggle pinch to zoom
    const togglePinchToZoom = useCallback((): void => {
        setConfig(prev => ({ ...prev, enablePinchToZoom: !prev.enablePinchToZoom }));
    }, []);

    // Toggle pull to refresh
    const togglePullToRefresh = useCallback((): void => {
        setConfig(prev => ({ ...prev, enablePullToRefresh: !prev.enablePullToRefresh }));
    }, []);

    // Add gesture
    const addGesture = useCallback((gesture: TouchGesture): void => {
        setGestures(prev => [...prev, gesture]);
    }, []);

    // Remove gesture
    const removeGesture = useCallback((id: string): void => {
        setGestures(prev => prev.filter(g => g.id !== id));
    }, []);

    // Enable/disable gesture
    const enableGesture = useCallback((id: string, enabled: boolean): void => {
        setGestures(prev => prev.map(g => 
            g.id === id ? { ...g, enabled } : g
        ));
    }, []);

    // Set swipe navigation
    const setSwipeNavigationConfig = useCallback((navigation: SwipeNavigation): void => {
        setSwipeNavigation(navigation);
    }, []);

    // Optimize for mobile
    const optimizeForMobile = useCallback((): void => {
        if (!viewport.isTouchDevice) return;
        
        // Enable mobile optimizations
        setOptimizations(prev => ({
            ...prev,
            enableVirtualScrolling: true,
            enableLazyLoading: true,
            enableImageOptimization: true,
            enableFontOptimization: true,
            enableNetworkOptimization: true,
            enableBatteryOptimization: true
        }));
        
        // Apply mobile-specific optimizations
        document.body.classList.add('mobile-optimized');
        
        // Optimize images for mobile
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
            img.setAttribute('loading', 'lazy');
        });
        
        // Optimize fonts for mobile
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://fonts.googleapis.com';
        document.head.appendChild(link);
        
        enableHapticFeedback('light');
    }, [viewport.isTouchDevice]);

    // Detect device type
    const detectDeviceType = useCallback((): MobileViewport => {
        updateViewport();
        return viewport;
    }, [updateViewport, viewport]);

    // Enable haptic feedback
    const enableHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy'): void => {
        if (!config.enableHapticFeedback || !('vibrate' in navigator)) return;
        
        const patterns = {
            light: [10],
            medium: [50],
            heavy: [100, 50, 100]
        };
        
        navigator.vibrate(patterns[type]);
    }, [config.enableHapticFeedback]);

    // Vibrate with custom pattern
    const vibrate = useCallback((pattern: number[]): void => {
        if (!config.enableHapticFeedback || !('vibrate' in navigator)) return;
        navigator.vibrate(pattern);
    }, [config.enableHapticFeedback]);

    // Scroll to top
    const scrollToTop = useCallback((): void => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        enableHapticFeedback('light');
    }, [enableHapticFeedback]);

    // Toggle fullscreen
    const toggleFullscreen = useCallback((): void => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        enableHapticFeedback('medium');
    }, [enableHapticFeedback]);

    // Set adaptive layout
    const setAdaptiveLayout = useCallback((): void => {
        applyAdaptiveLayout(viewport);
    }, [applyAdaptiveLayout, viewport]);

    // Get touch position
    const getTouchPosition = useCallback((event: TouchEvent): { x: number; y: number } => {
        const touch = event.touches[0] || event.changedTouches[0];
        return {
            x: touch.clientX,
            y: touch.clientY
        };
    }, []);

    // Initialize default gestures
    useEffect(() => {
        const defaultGestures: TouchGesture[] = [
            {
                id: 'swipe-back',
                type: 'swipe',
                direction: 'right',
                threshold: 100,
                action: () => {
                    window.history.back();
                    enableHapticFeedback('medium');
                },
                enabled: true,
                element: 'body'
            },
            {
                id: 'pull-to-refresh',
                type: 'swipe',
                direction: 'down',
                threshold: 80,
                action: () => {
                    window.location.reload();
                    enableHapticFeedback('heavy');
                },
                enabled: true,
                element: 'body'
            },
            {
                id: 'double-tap-zoom',
                type: 'doubleTap',
                threshold: 0,
                action: () => {
                    const currentZoom = parseFloat(document.documentElement.style.zoom || '1');
                    const newZoom = currentZoom === 1 ? 1.5 : 1;
                    document.documentElement.style.zoom = newZoom.toString();
                    enableHapticFeedback('medium');
                },
                enabled: true
            }
        ];
        
        defaultGestures.forEach(gesture => {
            addGesture(gesture);
        });
    }, [addGesture, enableHapticFeedback]);

    // Set up touch event listeners
    useEffect(() => {
        if (!config.enableTouchGestures) return;
        
        const handleTouchStartBound = handleTouchStart;
        const handleTouchMoveBound = handleTouchMove;
        const handleTouchEndBound = handleTouchEnd;
        
        document.addEventListener('touchstart', handleTouchStartBound, { passive: false });
        document.addEventListener('touchmove', handleTouchMoveBound, { passive: false });
        document.addEventListener('touchend', handleTouchEndBound, { passive: false });
        
        return () => {
            document.removeEventListener('touchstart', handleTouchStartBound);
            document.removeEventListener('touchmove', handleTouchMoveBound);
            document.removeEventListener('touchend', handleTouchEndBound);
        };
    }, [config.enableTouchGestures, handleTouchStart, handleTouchMove, handleTouchEnd]);

    // Set up resize listener
    useEffect(() => {
        const handleResize = () => {
            updateViewport();
        };
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, [updateViewport]);

    // Initialize viewport on mount
    useEffect(() => {
        updateViewport();
        
        if (viewport.isTouchDevice && config.enableMobileOptimizations) {
            optimizeForMobile();
        }
    }, []);

    const isMobile = viewport.deviceType === 'mobile';
    const isTablet = viewport.deviceType === 'tablet';
    const isTouchDevice = viewport.isTouchDevice;

    const value: MobileEnhancerContextType = {
        config,
        viewport,
        optimizations,
        gestures,
        isMobile,
        isTablet,
        isTouchDevice,
        toggleTouchGestures,
        toggleSwipeNavigation,
        togglePinchToZoom,
        togglePullToRefresh,
        addGesture,
        removeGesture,
        enableGesture,
        setSwipeNavigation: setSwipeNavigationConfig,
        optimizeForMobile,
        detectDeviceType,
        enableHapticFeedback,
        vibrate,
        scrollToTop,
        toggleFullscreen,
        setAdaptiveLayout,
        getTouchPosition
    };

    return (
        <MobileEnhancerContext.Provider value={value}>
            {children}
            
            {/* Mobile-specific UI elements */}
            {isMobile && (
                <>
                    {/* Floating action buttons */}
                    <button
                        onClick={scrollToTop}
                        className=\"fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50 md:hidden\"
                        aria-label=\"Scroll to top\"
                    >
                        <FiArrowUp />
                    </button>
                    
                    {/* Mobile navigation hint */}
                    {config.enableSwipeNavigation && (
                        <div className=\"fixed bottom-4 left-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs z-50 md:hidden\">
                            Swipe to navigate
                        </div>
                    )}
                </>
            )}
        </MobileEnhancerContext.Provider>
    );
};

// Hook to use mobile enhancer
export const useMobileEnhancer = () => {
    const context = useContext(MobileEnhancerContext);
    if (!context) {
        throw new Error('useMobileEnhancer must be used within MobileEnhancerProvider');
    }
    return context;
};

// Mobile Dashboard Component
interface MobileDashboardProps {
    className?: string;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({ 
    className = '' 
}) => {
    const { 
        config, 
        viewport, 
        optimizations, 
        isMobile, 
        isTablet, 
        isTouchDevice,
        toggleTouchGestures,
        toggleSwipeNavigation,
        togglePinchToZoom,
        optimizeForMobile,
        toggleFullscreen,
        gestures
    } = useMobileEnhancer();

    return (
        <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-900\">Mobile Enhancer</h2>
                <div className=\"flex items-center space-x-2\">
                    {isMobile && <FiSmartphone className=\"text-blue-500\" />}
                    {isTablet && <FiTablet className=\"text-green-500\" />}
                    {!isMobile && !isTablet && <FiMonitor className=\"text-gray-500\" />}
                    {isTouchDevice && <FiTouchApp className=\"text-purple-500\" />}
                </div>
            </div>

            {/* Device Information */}
            <div className=\"mb-6 p-4 bg-gray-50 rounded-lg\">
                <h3 className=\"text-lg font-semibold mb-3\">Device Information</h3>
                <div className=\"grid grid-cols-2 md:grid-cols-3 gap-4\">
                    <div>
                        <div className=\"text-sm text-gray-600\">Device Type</div>
                        <div className=\"font-medium capitalize\">{viewport.deviceType}</div>
                    </div>
                    <div>
                        <div className=\"text-sm text-gray-600\">Screen Size</div>
                        <div className=\"font-medium\">{viewport.width} × {viewport.height}</div>
                    </div>
                    <div>
                        <div className=\"text-sm text-gray-600\">Orientation</div>
                        <div className=\"font-medium capitalize\">{viewport.orientation}</div>
                    </div>
                    <div>
                        <div className=\"text-sm text-gray-600\">Pixel Ratio</div>
                        <div className=\"font-medium\">{viewport.pixelRatio}</div>
                    </div>
                    <div>
                        <div className=\"text-sm text-gray-600\">Touch Device</div>
                        <div className=\"font-medium\">{viewport.isTouchDevice ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                        <div className=\"text-sm text-gray-600\">Pixel Density</div>
                        <div className=\"font-medium\">{viewport.pixelRatio}x</div>
                    </div>
                </div>
            </div>

            {/* Mobile Configuration */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">Mobile Configuration</h3>
                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                    <button
                        onClick={toggleTouchGestures}
                        className={`flex items-center space-x-2 px-4 py-2 rounded ${
                            config.enableTouchGestures ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        <FiTouchApp />
                        <span>Touch Gestures</span>
                    </button>
                    
                    <button
                        onClick={toggleSwipeNavigation}
                        className={`flex items-center space-x-2 px-4 py-2 rounded ${
                            config.enableSwipeNavigation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        <FiNavigation />
                        <span>Swipe Navigation</span>
                    </button>
                    
                    <button
                        onClick={togglePinchToZoom}
                        className={`flex items-center space-x-2 px-4 py-2 rounded ${
                            config.enablePinchToZoom ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        <FiZoomIn />
                        <span>Pinch to Zoom</span>
                    </button>
                    
                    <button
                        onClick={optimizeForMobile}
                        className=\"flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600\"
                    >
                        <FiSettings />
                        <span>Optimize Mobile</span>
                    </button>
                </div>
            </div>

            {/* Mobile Optimizations */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">Mobile Optimizations</h3>
                <div className=\"grid grid-cols-2 md:grid-cols-3 gap-4\">
                    <div className=\"flex items-center space-x-2\">
                        <div className={`w-3 h-3 rounded-full ${optimizations.enableVirtualScrolling ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className=\"text-sm\">Virtual Scrolling</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <div className={`w-3 h-3 rounded-full ${optimizations.enableLazyLoading ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className=\"text-sm\">Lazy Loading</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <div className={`w-3 h-3 rounded-full ${optimizations.enableImageOptimization ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className=\"text-sm\">Image Optimization</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <div className={`w-3 h-3 rounded-full ${optimizations.enableFontOptimization ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className=\"text-sm\">Font Optimization</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <div className={`w-3 h-3 rounded-full ${optimizations.enableNetworkOptimization ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className=\"text-sm\">Network Optimization</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <div className={`w-3 h-3 rounded-full ${optimizations.enableBatteryOptimization ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className=\"text-sm\">Battery Optimization</span>
                    </div>
                </div>
            </div>

            {/* Active Gestures */}
            {gestures.length > 0 && (
                <div className=\"mb-6\">
                    <h3 className=\"text-lg font-semibold mb-3\">Active Gestures ({gestures.length})</h3>
                    <div className=\"space-y-2 max-h-48 overflow-y-auto\">
                        {gestures.map(gesture => (
                            <div key={gesture.id} className=\"flex items-center justify-between p-3 bg-gray-50 rounded\">
                                <div>
                                    <div className=\"font-medium\">{gesture.id}</div>
                                    <div className=\"text-sm text-gray-600\">
                                        {gesture.type} {gesture.direction && `(${gesture.direction})`}
                                    </div>
                                </div>
                                <div className={`px-2 py-1 text-xs rounded ${
                                    gesture.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {gesture.enabled ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className=\"flex flex-wrap gap-2\">
                <button
                    onClick={toggleFullscreen}
                    className=\"flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600\"
                >
                    <FiMaximize />
                    <span>Fullscreen</span>
                </button>
            </div>
        </div>
    );
};

export default MobileEnhancerProvider;
