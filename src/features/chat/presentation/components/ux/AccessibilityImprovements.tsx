/**
 * Accessibility Improvements Module
 * 
 * This module provides comprehensive accessibility features including keyboard navigation,
 * screen reader support, ARIA labels, and focus management for the chat feature.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
    FiKeyboard, 
    FiMic, 
    FiVolume2, 
    FiVolumeX, 
    FiEye,
    FiEyeOff,
    FiNavigation,
    FiSettings,
    FiSearch,
    FiHelpCircle,
    FiChevronDown,
    FiChevronUp,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';

// Accessibility types
export interface AccessibilityConfig {
    enableKeyboardNavigation: boolean;
    enableScreenReaderSupport: boolean;
    enableHighContrast: boolean;
    enableReducedMotion: boolean;
    enableLargeText: boolean;
    enableFocusIndicators: boolean;
    enableAnnouncements: boolean;
    language: string;
    announcements: Announcement[];
}

export interface Announcement {
    id: string;
    message: string;
    priority: 'polite' | 'assertive' | 'off';
    timestamp: number;
    timeout?: number;
}

export interface FocusRegion {
    id: string;
    element: HTMLElement | null;
    restoreFocus: () => void;
}

// Accessibility context
interface AccessibilityContextType {
    config: AccessibilityConfig;
    updateConfig: (config: Partial<AccessibilityConfig>) => void;
    announce: (message: string, priority?: 'polite' | 'assertive' | 'off') => void;
    addFocusRegion: (id: string, element: HTMLElement | null) => void;
    removeFocusRegion: (id: string) => void;
    restoreFocus: (id: string) => void;
    getFocusRegions: () => Map<string, FocusRegion>;
    isKeyboardUser: boolean;
    setKeyboardUser: (isKeyboard: boolean) => void;
    announce: (message: string, priority?: 'polite' | 'assertive' | 'off') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

// Accessibility Provider
interface AccessibilityProviderProps {
    children: ReactNode;
    defaultConfig?: Partial<AccessibilityConfig>;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
    children,
    defaultConfig = {}
}) => {
    const [config, setConfig] = useState<AccessibilityConfig>({
        enableKeyboardNavigation: true,
        enableScreenReaderSupport: true,
        enableHighContrast: false,
        enableReducedMotion: false,
        enableLargeText: false,
        enableFocusIndicators: true,
        enableAnnouncements: true,
        language: 'en',
        announcements: [],
        ...defaultConfig
    });

    const [focusRegions, setFocusRegions] = useState<Map<string, FocusRegion>>(new Map());
    const [isKeyboardUser, setIsKeyboardUser] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // Detect keyboard user
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab' || e.key === 'Escape') {
                setIsKeyboardUser(true);
            }
        };

        const handleMouseDown = () => {
            setIsKeyboardUser(false);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    // Respect system preferences
    useEffect(() => {
        const mediaQueries = [
            window.matchMedia('(prefers-reduced-motion: reduce)'),
            window.matchMedia('(prefers-color-scheme: dark)'),
            window.matchMedia('(prefers-contrast: high)'),
            window.matchMedia('(prefers-reduced-transparency: reduce)')
        ];

        const handleChange = () => {
            setConfig(prev => ({
                ...prev,
                enableReducedMotion: mediaQueries[0].matches,
                enableHighContrast: mediaQueries[2].matches
            }));
        };

        mediaQueries.forEach(mq => {
            mq.addEventListener('change', handleChange);
        });

        return () => {
            mediaQueries.forEach(mq => {
                mq.removeEventListener('change', handleChange);
            });
        };
    }, []);

    const updateConfig = useCallback((newConfig: Partial<AccessibilityConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    const announce = useCallback((message: string, priority: 'polite' | 'assertive' | 'off' = 'polite') => {
        if (!config.enableAnnouncements) return;

        const announcement: Announcement = {
            id: `announcement-${Date.now()}-${Math.random()}`,
            message,
            priority,
            timestamp: Date.now()
        };

        setAnnouncements(prev => [...prev.slice(-9), announcement]);

        // Clear old announcements
        setTimeout(() => {
            setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
        }, 5000);
    }, [config.enableAnnouncements]);

    const addFocusRegion = useCallback((id: string, element: HTMLElement | null) => {
        setFocusRegions(prev => {
            const newRegions = new Map(prev);
            if (element) {
                newRegions.set(id, {
                    id,
                    element,
                    restoreFocus: () => element?.focus()
                });
            } else {
                newRegions.delete(id);
            }
            return newRegions;
        });
    }, []);

    const removeFocusRegion = useCallback((id: string) => {
        setFocusRegions(prev => {
            const newRegions = new Map(prev);
            newRegions.delete(id);
            return newRegions;
        });
    }, []);

    const restoreFocus = useCallback((id: string) => {
        const region = focusRegions.get(id);
        if (region && region.element) {
            region.element.focus();
        }
    }, [focusRegions]);

    const getFocusRegions = useCallback(() => {
        return focusRegions;
    }, [focusRegions]);

    const value: AccessibilityContextType = {
        config,
        updateConfig,
        announce,
        addFocusRegion,
        removeFocusRegion,
        restoreFocus,
        getFocusRegions,
        isKeyboardUser,
        setKeyboardUser,
        announcements
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};

// Hook to use accessibility features
export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within AccessibilityProvider');
    }
    return context;
};

// Focus management hook
export const useFocusManagement = () => {
    const { addFocusRegion, removeFocusRegion, restoreFocus } = useAccessibility();
    const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);

    const setFocus = useCallback((element: HTMLElement | null, regionId?: string) => {
        if (!element) return;

        setActiveElement(element);
        element.focus();

        if (regionId) {
            addFocusRegion(regionId, element);
        }
    }, [addFocusRegion]);

    const clearFocus = useCallback(() => {
        if (activeElement) {
            activeElement.blur();
            setActiveElement(null);
        }
    }, [activeElement]);

    const trapFocus = useCallback((element: HTMLElement) => {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        firstElement.focus();

        // Trap focus within the element
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                
                const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);
                let nextIndex;

                if (e.shiftKey) {
                    // Shift+Tab: move to previous focusable element
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
                } else {
                    // Tab: move to next focusable element
                    nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
                }

                focusableElements[nextIndex].focus();
            }
        };

        element.addEventListener('keydown', handleKeyDown);

        return () => {
            element.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return {
        setFocus,
        clearFocus,
        trapFocus,
        activeElement
    };
};

// Keyboard navigation hook
export const useKeyboardNavigation = () => {
    const { config } = useAccessibility();
    const [navigationIndex, setNavigationIndex] = useState(0);
    const [navigationItems, setNavigationItems] = useState<Array<{
        element: HTMLElement | null;
        label: string;
        shortcut?: string;
    }>>([]);

    const registerNavigationItem = useCallback((element: HTMLElement | null, label: string, shortcut?: string) => {
        setNavigationItems(prev => [...prev, { element, label, shortcut }]);
    }, []);

    const navigateTo = useCallback((index: number) => {
        const item = navigationItems[index];
        if (item?.element) {
            item.element.focus();
            setNavigationIndex(index);
        }
    }, [navigationItems]);

    const navigateNext = useCallback(() => {
        const nextIndex = (navigationIndex + 1) % navigationItems.length;
        navigateTo(nextIndex);
    }, [navigationIndex, navigationItems, navigateTo]);

    const navigatePrevious = useCallback(() => {
        const prevIndex = navigationIndex === 0 ? navigationItems.length - 1 : navigationIndex - 1;
        navigateTo(prevIndex);
    }, [navigationIndex, navigationItems, navigateTo]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!config.enableKeyboardNavigation) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                navigateNext();
                break;
            case 'ArrowUp':
                e.preventDefault();
                navigatePrevious();
                break;
            case 'Home':
                e.preventDefault();
                navigateTo(0);
                break;
            case 'End':
                e.preventDefault();
                navigateTo(navigationItems.length - 1);
                break;
        }
    }, [config.enableKeyboardNavigation, navigateNext, navigatePrevious, navigateTo, navigationIndex, navigationItems]);

    return {
        registerNavigationItem,
        navigateTo,
        navigateNext,
        navigatePrevious,
        handleKeyDown,
        navigationIndex,
        navigationItems
    };
};

// Screen reader support hook
export const useScreenReader = () => {
    const { config, announce } = useAccessibility();

    const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' | 'off' = 'polite') => {
        if (!config.enableScreenReaderSupport) return;

        // Create a live region for announcements
        let liveRegion = document.getElementById('accessibility-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.setAttribute('id', 'accessibility-live-region');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }

        liveRegion.textContent = message;
        announce(message, priority);
    }, [config.enableScreenReaderSupport, announce]);

    const announcePolite = useCallback((message: string) => {
        announceToScreenReader(message, 'polite');
    }, [announceToScreenReader]);

    const announceAssertive = useCallback((message: string) => {
        announceToScreenReader(message, 'assertive');
    }, [announceToScreenReader]);

    return {
        announceToScreenReader,
        announcePolite,
        announceAssertive
    };
};

// ARIA utilities
export const useAria = () => {
    const { config } = useAccessibility();

    const generateAriaLabel = useCallback((text: string, context?: string) => {
        let label = text;
        if (context) {
            label = `${text}, ${context}`;
        }
        return label;
    }, []);

    const generateAriaDescribedBy = useCallback((text: string, describedBy: string) => {
        return `${text}, described by ${describedBy}`;
    }, []);

    const generateAriaLabelledBy = useCallback((text: string, labelledBy: string) => {
        return `${text}, labelled by ${labelledBy}`;
    }, []);

    const generateAriaRequired = useCallback((text: string, isRequired: boolean = true) => {
        return `${text}${isRequired ? ' (required)' : ''}`;
    }, []);

    const generateAriaInvalid = useCallback((text: string, isInvalid: boolean = true) => {
        return `${text}${isInvalid ? ' (invalid)' : ''}`;
    }, []);

    const generateAriaExpanded = useCallback((text: string, isExpanded: boolean) => {
        return `${text}, ${isExpanded ? 'expanded' : 'collapsed'}`;
    }, []);

    const generateAriaSelected = useCallback((text: string, isSelected: boolean) => {
        return `${text}, ${isSelected ? 'selected' : 'not selected'}`;
    }, []);

    const generateAriaDisabled = useCallback((text: string, isDisabled: boolean) => {
        return `${text}, ${isDisabled ? 'disabled' : 'enabled'}`;
    }, []);

    const generateAriaBusy = useCallback((text: string, isBusy: boolean) => {
        return `${text}, ${isBusy ? 'busy' : 'available'}`;
    }, []);

    const generateAriaLiveRegion = useCallback((text: string, isLive: boolean = true) => {
        return `${text}, ${isLive ? 'live' : 'static'}`;
    }, []);

    return {
        generateAriaLabel,
        generateAriaDescribedBy,
        generateAriaLabelledBy,
        generateAriaRequired,
        generateAriaInvalid,
        generateAriaExpanded,
        generateAriaSelected,
        generateAriaDisabled,
        generateAriaBusy,
        generateAriaLiveRegion
    };
};

// Skip links component
export const SkipLinks: React.FC = () => {
    const { config } = useAccessibility();

    const skipLinks = [
        { href: '#main-content', label: 'Skip to main content' },
        { href: '#navigation', label: 'Skip to navigation' },
        { href: '#messages', label: 'Skip to messages' },
        { href: '#sidebar', label: 'Skip to sidebar' }
    ];

    return (
        <div className=\"sr-only\" role=\"navigation\" aria-label=\"Skip navigation links\">
            {skipLinks.map((link, index) => (
                <a
                    key={index}
                    href={link.href}
                    className=\"block p-2 bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2\"
                >
                    {link.label}
                </a>
            ))}
        </div>
    );
};

// Focus indicator component
export const FocusIndicator: React.FC<{
    visible?: boolean;
    className?: string;
}> = ({ 
    visible = true, 
    className = ''
}) => {
    if (!visible) return null;

    return (
        <div 
            className={`absolute inset-0 pointer-events-none ring-2 ring-blue-500 ring-opacity-75 ${className}`}
            aria-hidden=\"true\"
        />
    );
};

// Keyboard shortcut component
export const KeyboardShortcut: React.FC<{
    shortcut: string;
    description: string;
    action: () => void;
    className?: string;
}> = ({ 
    shortcut, 
    description, 
    action, 
    className = ''
}) => {
    const { config } = useAccessibility();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === shortcut && config.enableKeyboardNavigation) {
            e.preventDefault();
            action();
        }
    }, [shortcut, action, config.enableKeyboardNavigation]);

    return (
        <div
            className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
            title={`${shortcut} - ${description}`}
            onKeyDown={handleKeyDown}
        >
            <FiKeyboard className=\"w-4 h-4\" />
            <kbd className=\"px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono\">
                {shortcut}
            </kbd>
            <span>{description}</span>
        </div>
    );
};

// High contrast mode toggle
export const HighContrastToggle: React.FC<{
    className?: string;
}> = ({ className = '' }) => {
    const { config, updateConfig } = useAccessibility();

    const toggleHighContrast = () => {
        updateConfig({ enableHighContrast: !config.enableHighContrast });
    };

    return (
        <button
            onClick={toggleHighContrast}
            className={`flex items-center space-x-2 p-2 rounded-lg border ${
                config.enableHighContrast 
                    ? 'bg-gray-900 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
            } ${className}`}
            title={config.enableHighContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
            aria-label={config.enableHighContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
        >
            <FiEye className=\"w-4 h-4\" />
            <span className=\"text-sm font-medium\">
                {config.enableHighContrast ? 'High Contrast' : 'Normal Contrast'}
            </span>
        </button>
    );
};

// Large text toggle
export const LargeTextToggle: React.FC<{
    className?: string;
}> = ({ className = '' }) => {
    const { config, updateConfig } = useAccessibility();

    const toggleLargeText = () => {
        updateConfig({ enableLargeText: !config.enableLargeText });
    };

    return (
        <button
            onClick={toggleLargeText}
            className={`flex items-center space-x-2 p-2 rounded-lg border ${
                config.enableLargeText 
                    ? 'bg-gray-900 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
            } ${className}`}
            title={config.enableLargeText ? 'Disable large text mode' : 'Enable large text mode'}
            aria-label={config.enableLargeText ? 'Disable large text mode' : 'Enable large text mode'}
        >
            <FiSettings className=\"w-4 h-4\" />
            <span className=\"text-sm font-medium\">
                {config.enableLargeText ? 'Large Text' : 'Normal Text'}
            </span>
        </button>
    );
};

// Reduced motion toggle
export const ReducedMotionToggle: React.FC<{
    className?: string;
}> = ({ className = '' }) => {
    const { config, updateConfig } = useAccessibility();

    const toggleReducedMotion = () => {
        updateConfig({ enableReducedMotion: !config.enableReducedMotion });
    };

    return (
        <button
            onClick={toggleReducedMotion}
            className={`flex items-center space-x-2 p-2 rounded-lg border ${
                config.enableReducedMotion 
                    ? 'bg-gray-900 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
            } ${className}`}
            title={config.enableReducedMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
            aria-label={config.enableReducedMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
        >
            <FiActivity className=\"w-4 h-4\" />
            <span className=\"text-sm font-medium\">
                {config.enableReducedMotion ? 'Reduced Motion' : 'Normal Motion'}
            </span>
        </button>
    );
};

// Screen reader toggle
export const ScreenReaderToggle: React.FC<{
    className?: string;
}> = ({ className = '' }) => {
    const { config, updateConfig } = useAccessibility();

    const toggleScreenReader = () => {
        updateConfig({ enableScreenReaderSupport: !config.enableScreenReaderSupport });
    };

    return (
        <button
            onClick={toggleScreenReader}
            className={`flex items-center space-x-2 p-2 rounded-lg border ${
                config.enableScreenReaderSupport 
                    ? 'bg-gray-900 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
            } ${className}`}
            title={config.enableScreenReaderSupport ? 'Disable screen reader support' : 'Enable screen reader support'}
            aria-label={config.enableScreenReaderSupport ? 'Disable screen reader support' : 'Enable screen reader support'}
        >
            <FiMic className={`w-4 h-4 ${config.enableScreenReaderSupport ? 'text-green-500' : 'text-gray-500'}`} />
            <span className=\"text-sm font-medium\">
                {config.enableScreenReaderSupport ? 'Screen Reader On' : 'Screen Reader Off'}
            </span>
        </button>
    );
};

// Accessibility toolbar
export const AccessibilityToolbar: React.FC<{
    className?: string;
}> = ({ className = '' }) => {
    const { config, updateConfig } = useAccessibility();

    return (
        <div className={`flex items-center space-x-2 p-2 bg-gray-100 rounded-lg ${className}`}>
            <HighContrastToggle />
            <LargeTextToggle />
            <ReducedMotionToggle />
            <ScreenReaderToggle />
            
            <div className=\"w-px h-6 bg-gray-300 rounded\" />
            
            <KeyboardShortcut
                shortcut=\"Alt+H"
                description=\"Show accessibility help\"
                action={() => {
                    updateConfig({ enableAnnouncements: !config.enableAnnouncements });
                }}
            />
            
            <KeyboardShortcut
                shortcut=\"Alt+K"
                description=\"Toggle keyboard navigation\"
                action={() => {
                    updateConfig({ enableKeyboardNavigation: !config.enableKeyboardNavigation });
                }}
            />
        </div>
    );
};

export default {
    AccessibilityProvider,
    useAccessibility,
    useFocusManagement,
    useKeyboardNavigation,
    useScreenReader,
    useAria,
    SkipLinks,
    FocusIndicator,
    KeyboardShortcut,
    HighContrastToggle,
    LargeTextToggle,
    ReducedMotionToggle,
    ScreenReaderToggle,
    AccessibilityToolbar
};
