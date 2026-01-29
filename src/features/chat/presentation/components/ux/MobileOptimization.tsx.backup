/**
 * Mobile Optimization Module
 * 
 * This module provides mobile-specific optimizations including touch gestures,
 * responsive design patterns, and mobile performance enhancements for the chat feature.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
    FiSmartphone, 
    FiTablet, 
    FiMonitor,
    FiChevronLeft,
    FiChevronRight,
    FiMenu,
    FiX,
    FiSearch,
    FiMoreVertical,
    FiBell,
    FiSettings,
    FiSend,
    FiMic,
    FiCamera,
    FiPaperclip,
    FiSmile,
    FiPaper,
    FiUsers,
    FiMessageSquare
} from 'react-icons/fi';

// Mobile device detection
export interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isSafari: boolean;
    isChrome: boolean;
    isFirefox: isFirefox;
    orientation: 'portrait' | 'landscape';
    screenWidth: number;
    screenHeight: number;
    pixelRatio: number;
    touchSupported: boolean;
}

// Touch gesture types
export interface TouchGesture {
    type: 'tap' | 'swipe' | 'pinch' | 'longPress' | 'doubleTap';
    startX: number;
    startY: number;
    endX?: number;
    endY?: number;
    duration?: number;
    distance?: number;
    direction?: 'left' | 'right' | 'up' | 'down';
    velocity?: number;
    scale?: number;
    timestamp: number;
}

// Mobile context
interface MobileContextType {
    deviceInfo: DeviceInfo;
    isKeyboardOpen: boolean;
    isSidebarOpen: boolean;
    isSearchOpen: boolean;
    isMenuOpen: boolean;
    setKeyboardOpen: (open: boolean) => void;
    setSidebarOpen: (open: boolean) => void;
    setSearchOpen: (open: boolean) => void;
    setMenuOpen: (open: boolean) => void;
    addTouchGesture: (gesture: TouchGesture) => void;
    removeTouchGesture: (id: string) => void;
    getTouchGestures: () => TouchGesture[];
}

const MobileContext = createContext<MobileContextType | null>(null);

// Mobile Provider
interface MobileProviderProps {
    children: ReactNode;
}

export const MobileProvider: React.FC<MobileProviderProps> = ({ children }) => {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isIOS: false,
        isAndroid: false,
        isSafari: false,
        isChrome: false,
        isFirefox: false,
        orientation: 'portrait',
        screenWidth: 1920,
        screenHeight: 1080,
        pixelRatio: 1,
        touchSupported: false
    });

    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [touchGestures, setTouchGestures] = useState<Map<string, TouchGesture>>(new Map());

    // Detect device information
    useEffect(() => {
        const updateDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const pixelRatio = window.devicePixelRatio || 1;

            // Detect device type
            const isMobile = /iphone|ipod|android|blackberry|iemobile|opera mini|windows phone|windows ce|palm|smartphone|mobile/i.test(userAgent);
            const isTablet = /ipad|android(?!.*mobile)|silk/i.test(userAgent) || (isMobile && screenWidth > 768);
            const isDesktop = !isMobile && !isTablet;
            
            // Detect OS
            const isIOS = /iphone|ipad|ipod|macintosh/i.test(userAgent);
            const isAndroid = /android/i.test(userAgent);
            const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);
            const isChrome = /chrome/i.test(userAgent) && !/edge/i.test(userAgent);
            const isFirefox = /firefox/i.test(userAgent);

            // Detect orientation
            const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';

            // Detect touch support
            const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            setDeviceInfo({
                isMobile,
                isTablet,
                isDesktop,
                isIOS,
                isAndroid,
                isSafari,
                isChrome,
                isFirefox,
                orientation,
                screenWidth,
                screenHeight,
                pixelRatio,
                touchSupported
            });
        };

        updateDevice();

        const handleResize = () => {
            updateDevice();
        };

        const handleOrientationChange = () => {
            updateDevice();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    const setKeyboardOpen = useCallback((open: boolean) => {
        setIsKeyboardOpen(open);
    }, []);

    const setSidebarOpen = useCallback((open: boolean) => {
        setIsSidebarOpen(open);
    }, []);

    const setSearchOpen = useCallback((open: boolean) => {
        setIsSearchOpen(open);
    }, []);

    const setMenuOpen = useCallback((open: boolean) => {
        setIsMenuOpen(open);
    }, []);

    const addTouchGesture = useCallback((gesture: TouchGesture) => {
        const id = `gesture-${Date.now()}-${Math.random()}`;
        setTouchGestures(prev => new Map(prev).set(id, gesture));
        
        // Auto-remove old gestures after 5 seconds
        setTimeout(() => {
            setTouchGestures(prev => {
                const newGestures = new Map(prev);
                newGestures.delete(id);
                return newGestures;
            });
        }, 5000);
    }, []);

    const removeTouchGesture = useCallback((id: string) => {
        setTouchGestures(prev => {
            const newGestures = new Map(prev);
            newGestures.delete(id);
            return newGestures;
        });
    }, []);

    const getTouchGestures = useCallback(() => {
        return Array.from(touchGestures.values());
    }, [touchGestures]);

    const value: MobileContextType = {
        deviceInfo,
        isKeyboardOpen,
        isSidebarOpen,
        isSearchOpen,
        isMenuOpen,
        setKeyboardOpen,
        setSidebarOpen,
        setSearchOpen,
        setMenuOpen,
        addTouchGesture,
        removeTouchGesture,
        getTouchGestures
    };

    return (
        <MobileContext.Provider value={value}>
            {children}
        </MobileContext.Provider>
    );
};

// Hook to use mobile features
export const useMobile = () => {
    const context = useContext(MobileContext);
    if (!context) {
        throw new Error('useMobile must be used within MobileProvider');
    }
    return context;
};

// Touch gesture handling hook
export const useTouchGestures = (element: HTMLElement) => {
    const { addTouchGesture } = useMobile();
    const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number; time: number } | null>(null);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (e.touches.length === 0) return;
        
        const touch = e.touches[0];
        setTouchStart({
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        });
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!touchStart || e.touches.length === 0) return;

        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        const currentTime = Date.now();

        const gesture: TouchGesture = {
            type: 'swipe',
            startX: touchStart.x,
            startY: touchStart.y,
            endX: currentX,
            endY: currentY,
            duration: currentTime - touchStart.time,
            distance: Math.sqrt(
                Math.pow(currentX - touchStart.x, 2) + Math.pow(currentY - touchStart.y, 2)
            ),
            direction: currentX > touchStart.x ? 'right' : currentX < touchStart.x ? 'left' : currentY > touchStart.y ? 'down' : 'up',
            timestamp: currentTime
        };

        addTouchGesture(gesture);
    }, [touchStart, addTouchGesture]);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (e.touches.length === 0 && touchStart) {
            const currentTime = Date.now();
            
            const gesture: TouchGesture = {
                type: 'tap',
                startX: touchStart.x,
                startY: touchStart.y,
                endX: touchStart.x,
                endY: touchStart.y,
                duration: currentTime - touchStart.time,
                timestamp: currentTime
            };

            addTouchGesture(gesture);
            setTouchStart(null);
            setTouchEnd({ x: touchStart.x, y: touchStart.y, time: currentTime });
        }
    }, [touchStart, touchStart, addTouchGesture]);

    const handleDoubleTap = useCallback((e: TouchEvent) => {
        if (e.touches.length === 0 && touchEnd) {
            const currentTime = Date.now();
            const timeSinceLastTouch = currentTime - touchEnd.time;
            
            if (timeSinceTouch < 300) {
                const gesture: TouchGesture = {
                    type: 'doubleTap',
                    startX: touchEnd.x,
                    startY: touchEnd.y,
                    endX: touchEnd.x,
                    endY: touchEnd.y,
                    duration: 0,
                    timestamp: currentTime
                };

                addTouchGesture(gesture);
            }
        }
    }, [touchEnd, addTouchGesture]);

    const handleLongPress = useCallback((e: TouchEvent) => {
        if (e.touches.length === 0 && touchStart) {
            const currentTime = Date.now();
            const timeSinceStart = currentTime - touchStart.time;
            
            if (timeSinceStart >= 500) {
                const gesture: TouchGesture = {
                    type: 'longPress',
                    startX: touchStart.x,
                    startY: touchStart.y,
                    endX: touchStart.x,
                    endY: touchStart.y,
                    duration: timeSinceStart,
                    timestamp: currentTime
                };

                addTouchGesture(gesture);
            }
        }
    }, [touchStart, addTouchGesture]);

    useEffect(() => {
        const elementRef = element;
        
        if (!elementRef) return;

        elementRef.addEventListener('touchstart', handleTouchStart);
        elementRef.addEventListener('touchmove', handleTouchMove);
        elementRef.addEventListener('touchend', handleTouchEnd);
        elementRef.addEventListener('touchstart', handleDoubleTap);
        elementRef.addEventListener('touchstart', handleLongPress);

        return () => {
            elementRef.removeEventListener('touchstart', handleTouchStart);
            elementRef.removeEventListener('touchmove', handleTouchMove);
            elementRef.removeEventListener('touchend', handleTouchEnd);
            elementRef.removeEventListener('touchstart', handleDoubleTap);
            elementRef.removeEventListener('touchstart', handleLongPress);
        };
    }, [element, handleTouchStart, handleTouchMove, handleTouchEnd, handleDoubleTap, handleLongPress]);
};

    return {
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleDoubleTap,
        handleLongPress
    };
};

// Swipe detection hook
export const useSwipeDetection = (element: HTMLElement, onSwipe?: (direction: string) => void) => {
    const { addTouchGesture } = useMobile();
    const [swipeDirection, setSwipeDirection] = useState<string | null>(null);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        const previousTouch = e.changedTouches[0];
        
        if (previousTouch) {
            const deltaX = touch.clientX - previousTouch.clientX;
            const deltaY = touch.clientY - previousTouch.clientY;
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            
            if (absDeltaX > absDeltaY && absDeltaX > 30) {
                const direction = deltaX > 0 ? 'right' : 'left';
                setSwipeDirection(direction);
                onSwipe?.(direction);
            }
        }
    }, [addTouchGesture, onSwipe]);

    useEffect(() => {
        const elementRef = element;
        
        if (!elementRef) return;

        elementRef.addEventListener('touchmove', handleTouchMove);

        return () => {
            elementRef.removeEventListener('touchmove', handleTouchMove);
        };
    }, [element, handleTouchMove]);

    return {
        swipeDirection
    };
};

// Viewport detection hook
export const useViewport = () => {
    const { deviceInfo } = useMobile();
    const [viewport, setViewport] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY
    });

    useEffect(() => {
        const handleResize = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
                scrollX: window.scrollX,
                scrollY:  window.scrollY
            });
        };

        const handleScroll = () => {
            setViewport(prev => ({
                ...prev,
                scrollX: window.scrollX,
                scrollY: scrollY
            }));
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return {
        viewport,
        isMobile: deviceInfo.isMobile,
        isTablet: deviceInfo.isTablet,
        isDesktop: deviceInfo.isDesktop,
        isLandscape: deviceInfo.orientation === 'landscape',
        isPortrait: deviceInfo.orientation === 'portrait',
        isSmallScreen: deviceInfo.screenWidth < 768,
        isMediumScreen: deviceInfo.screenWidth >= 768 && deviceInfo.screenWidth < 1024,
        isLargeScreen: deviceInfo.screenWidth >= 1024
    };
};

// Responsive hook
export const useResponsive = () => {
    const { viewport } = useViewport();
    
    return {
        isMobile: viewport.isMobile,
        isTablet: viewport.isTablet,
        isDesktop: viewport.isDesktop,
        isLandscape: viewport.isLandscape,
        isPortrait: viewport.isPortrait,
        isSmallScreen: viewport.isSmallScreen,
        isMediumScreen: viewport.isMediumScreen,
        isLargeScreen: isLargeScreen,
        width: viewport.width,
        height: viewport.height
    };
};

// Mobile navigation hook
export const useMobileNavigation = () => {
    const { 
        deviceInfo, 
        isKeyboardOpen, 
        isSidebarOpen, 
        isSearchOpen, 
        isMenuOpen 
    } = useMobile();

    const toggleKeyboard = useCallback(() => {
        if (deviceInfo.isMobile) {
            // Toggle virtual keyboard on mobile
            const input = document.querySelector('input[type=\"text\"], textarea') as HTMLElement;
            if (input) {
                input.focus();
            }
        }
    }, [deviceInfo.isMobile]);

    const toggleSidebar = useCallback(() => {
        if (deviceInfo.isMobile) {
            // Toggle sidebar on mobile
            const sidebar = document.querySelector('[data-mobile-sidebar]') as HTMLElement;
            if (sidebar) {
                sidebar.classList.toggle('translate-x-0');
            }
        }
    }, [deviceInfo.isMobile]);

    const toggleSearch = useCallback(() => {
        if (deviceInfo.isMobile) {
            // Toggle search on mobile
            const search = document.querySelector('[data-mobile-search]') as HTMLElement;
            if (search) {
                search.classList.toggle('translate-x-0');
            }
        }
    }, [deviceInfo.isMobile]);

    const toggleMenu = useCallback(() => {
        if (deviceInfo.isMobile) {
            // Toggle menu on mobile
            const menu = document.querySelector('[data-mobile-menu]') as HTMLElement;
            if (menu) {
                menu.classList.toggle('translate-x-0');
            }
        }
    }, [deviceInfo.isMobile]);

    return {
        toggleKeyboard,
        toggleSidebar,
        toggleSearch,
        toggleMenu,
        isKeyboardOpen,
        isSidebarOpen,
        isSearchOpen,
        isMenuOpen
    };
};

// Touch feedback hook
export const useTouchFeedback = () => {
    const { deviceInfo } = useMobile();

    const provideFeedback = useCallback((type: 'light' | 'medium' | 'strong') => {
        if (!deviceInfo.isMobile || !deviceInfo.touchSupported) return;

        // Create vibration if supported
        if ('vibrate' in navigator) {
            const vibrationPatterns = {
                light: [10],
                medium: [50],
                strong: [100, 50, 10]
            };
            
            navigator.vibrate(...vibrationPatterns[type]);
        }
    }, [deviceInfo.isMobile, deviceInfo.touchSupported]);

    return {
        provideFeedback,
        isTouchSupported: deviceInfo.touchSupported
    };
};

// Mobile keyboard utilities
export const useMobileKeyboard = () => {
    const { deviceInfo, isKeyboardOpen } = useMobile();
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        if (deviceInfo.isMobile) {
            // Detect virtual keyboard height
            const visualViewport = window.visualViewport;
            const layoutViewport = window.layoutViewport;
            const keyboardHeight = layoutViewport.height - visualViewport.height;
            setKeyboardHeight(keyboardHeight);
        }
    }, [deviceInfo.isMobile]);

    return {
        keyboardHeight,
        isKeyboardOpen,
        isMobile: deviceInfo.isMobile
    };
};

// Mobile optimization utilities
export const useMobileOptimization = () => {
    const { deviceInfo } = useMobile();

    const optimizeForMobile = useCallback(() => {
        if (!deviceInfo.isMobile) return;

        // Optimize images for mobile
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
            img.src = img.src; // Trigger loading
        });

        // Optimize fonts for mobile
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://fonts.googleapis.com';
        document.head.appendChild(link);

        // Optimize rendering for mobile
        document.body.style.webkitTapHighlightColor = 'transparent';
        document.body.style.webkitTouchCallout = 'none';
        document.body.style.webkitUserSelect = 'none';

        // Add mobile-specific CSS
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .mobile-only {
                    display: block !important;
                }
                .desktop-only {
                    display: none !important;
                }
            }
            
            @media (min-width: 769px) {
                .mobile-only {
                    display: none !important;
                }
                .desktop-only {
                    display: block !important;
                }
            }
            
            /* Mobile-specific optimizations */
            .mobile-optimized {
                -webkit-overflow-scrolling: touch;
                -webkit-overflow-scrolling: touch;
                overflow-scrolling: touch;
            }
            
            /* Touch feedback */
            .touch-feedback {
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
            }
            
            /* Smooth scrolling for mobile */
            .smooth-scroll-mobile {
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
            }
            
            /* Prevent zoom on mobile */
            .no-zoom {
                touch-action: manipulation;
                -ms-touch-action: manipulation;
            }
        `;
        document.head.appendChild(style);
    }, [deviceInfo.isMobile]);

    return {
        optimizeForMobile
    };
};

export default {
    MobileProvider,
    useMobile,
    useTouchGestures,
    useSwipeDetection,
    useViewport,
    useResponsive,
    useMobileNavigation,
    useTouchFeedback,
    useMobileKeyboard,
    useMobileOptimization
};
