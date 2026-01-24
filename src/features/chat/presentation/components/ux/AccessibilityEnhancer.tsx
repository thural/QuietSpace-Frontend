/**
 * Accessibility Enhancer
 * 
 * This component provides comprehensive accessibility features including
 * WCAG 2.1 compliance, screen reader support, keyboard navigation, and
 * assistive technology integration.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
    FiEye, 
    FiEyeOff, 
    FiKeyboard, 
    FiMousePointer, 
    FiVolume2, 
    FiVolumeX,
    FiSettings,
    FiCheck,
    FiAlertTriangle,
    FiInfo,
    FiNavigation,
    FiZoomIn,
    FiZoomOut,
    FiSun,
    FiMoon
} from 'react-icons/fi';

export interface AccessibilityConfig {
    enableScreenReaderSupport: boolean;
    enableKeyboardNavigation: boolean;
    enableHighContrast: boolean;
    enableLargeText: boolean;
    enableReducedMotion: boolean;
    enableFocusIndicators: boolean;
    enableAriaLabels: boolean;
    enableLiveRegions: boolean;
    enableSkipLinks: boolean;
    enableColorBlindSupport: boolean;
    language: string;
    readingSpeed: 'slow' | 'normal' | 'fast';
    announcementLevel: 'polite' | 'assertive' | 'off';
}

export interface AccessibilityViolation {
    id: string;
    type: 'error' | 'warning' | 'info';
    category: 'color' | 'contrast' | 'keyboard' | 'aria' | 'structure' | 'focus';
    element: string;
    description: string;
    wcagGuideline: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestion: string;
    autoFixable: boolean;
}

export interface FocusTrapConfig {
    enabled: boolean;
    restoreFocus: boolean;
    escapeKey: string;
    initialFocus?: string;
    finalFocus?: string;
}

export interface KeyboardNavigationPattern {
    name: string;
    keys: string[];
    description: string;
    action: (element: HTMLElement, event: KeyboardEvent) => void;
    enabled: boolean;
}

export interface ScreenReaderAnnouncement {
    id: string;
    message: string;
    priority: 'polite' | 'assertive';
    timestamp: Date;
    timeout?: number;
}

interface AccessibilityEnhancerContextType {
    config: AccessibilityConfig;
    violations: AccessibilityViolation[];
    announcements: ScreenReaderAnnouncement[];
    isHighContrast: boolean;
    isLargeText: boolean;
    currentFocusElement: HTMLElement | null;
    
    // Actions
    toggleHighContrast: () => void;
    toggleLargeText: () => void;
    toggleReducedMotion: () => void;
    toggleScreenReaderSupport: () => void;
    toggleKeyboardNavigation: () => void;
    announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
    checkAccessibility: () => Promise<AccessibilityViolation[]>;
    fixViolations: (violationIds: string[]) => Promise<void>;
    enableFocusTrap: (container: HTMLElement, config?: FocusTrapConfig) => () => void;
    addKeyboardPattern: (pattern: KeyboardNavigationPattern) => void;
    removeKeyboardPattern: (name: string) => void;
    setFocusIndicator: (element: HTMLElement, visible: boolean) => void;
    generateAriaLabel: (element: HTMLElement, context?: string) => string;
    skipToContent: () => void;
    setLanguage: (language: string) => void;
    setReadingSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
}

const AccessibilityEnhancerContext = createContext<AccessibilityEnhancerContextType | null>(null);

// Accessibility Enhancer Provider
interface AccessibilityEnhancerProviderProps {
    children: React.ReactNode;
    config?: Partial<AccessibilityConfig>;
}

export const AccessibilityEnhancerProvider: React.FC<AccessibilityEnhancerProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config, setConfig] = useState<AccessibilityConfig>({
        enableScreenReaderSupport: true,
        enableKeyboardNavigation: true,
        enableHighContrast: false,
        enableLargeText: false,
        enableReducedMotion: false,
        enableFocusIndicators: true,
        enableAriaLabels: true,
        enableLiveRegions: true,
        enableSkipLinks: true,
        enableColorBlindSupport: false,
        language: 'en',
        readingSpeed: 'normal',
        announcementLevel: 'polite',
        ...userConfig
    });

    const [violations, setViolations] = useState<AccessibilityViolation[]>([]);
    const [announcements, setAnnouncements] = useState<ScreenReaderAnnouncement[]>([]);
    const [isHighContrast, setIsHighContrast] = useState(false);
    const [isLargeText, setIsLargeText] = useState(false);
    const [currentFocusElement, setCurrentFocusElement] = useState<HTMLElement | null>(null);

    const liveRegionRef = useRef<HTMLDivElement>(null);
    const politeRegionRef = useRef<HTMLDivElement>(null);
    const assertiveRegionRef = useRef<HTMLDivElement>(null);
    const keyboardPatternsRef = useRef<Map<string, KeyboardNavigationPattern>>(new Map());
    const focusTrapRef = useRef<{ container: HTMLElement; config: FocusTrapConfig } | null>(null);

    // WCAG 2.1 accessibility rules
    const wcagRules = {
        colorContrast: {
            check: (element: HTMLElement): AccessibilityViolation | null => {
                const styles = window.getComputedStyle(element);
                const color = styles.color;
                const backgroundColor = styles.backgroundColor;
                
                // Simplified contrast calculation
                const contrast = calculateContrast(color, backgroundColor);
                
                if (contrast < 4.5) {
                    return {
                        id: `contrast-${Date.now()}`,
                        type: 'error',
                        category: 'contrast',
                        element: element.tagName.toLowerCase(),
                        description: `Insufficient color contrast (${contrast.toFixed(2)}:1)`,
                        wcagGuideline: 'WCAG 2.1 1.4.3',
                        severity: 'high',
                        suggestion: 'Increase color contrast to at least 4.5:1',
                        autoFixable: true
                    };
                }
                
                return null;
            },
            fix: (element: HTMLElement) => {
                element.style.filter = 'contrast(1.2)';
            }
        },
        keyboardNavigation: {
            check: (element: HTMLElement): AccessibilityViolation | null => {
                if (element.tabIndex < 0 && !element.getAttribute('aria-hidden')) {
                    return {
                        id: `keyboard-${Date.now()}`,
                        type: 'warning',
                        category: 'keyboard',
                        element: element.tagName.toLowerCase(),
                        description: 'Element is not keyboard accessible',
                        wcagGuideline: 'WCAG 2.1 2.1.1',
                        severity: 'medium',
                        suggestion: 'Add tabindex or ensure element is keyboard accessible',
                        autoFixable: true
                    };
                }
                return null;
            },
            fix: (element: HTMLElement) => {
                if (element.tabIndex < 0) {
                    element.tabIndex = 0;
                }
            }
        },
        ariaLabels: {
            check: (element: HTMLElement): AccessibilityViolation | null => {
                const hasAriaLabel = element.hasAttribute('aria-label') || 
                                   element.hasAttribute('aria-labelledby') ||
                                   element.getAttribute('role') === 'presentation';
                
                const needsLabel = ['button', 'input', 'textarea', 'select', 'a'].includes(element.tagName.toLowerCase());
                
                if (needsLabel && !hasAriaLabel && !element.textContent?.trim()) {
                    return {
                        id: `aria-${Date.now()}`,
                        type: 'warning',
                        category: 'aria',
                        element: element.tagName.toLowerCase(),
                        description: 'Interactive element missing accessible name',
                        wcagGuideline: 'WCAG 2.1 1.3.1',
                        severity: 'medium',
                        suggestion: 'Add aria-label, aria-labelledby, or visible text',
                        autoFixable: true
                    };
                }
                
                return null;
            },
            fix: (element: HTMLElement) => {
                if (!element.getAttribute('aria-label')) {
                    const label = generateAriaLabel(element);
                    element.setAttribute('aria-label', label);
                }
            }
        }
    };

    // Calculate color contrast (simplified)
    const calculateContrast = (color1: string, color2: string): number => {
        // This is a simplified calculation - in production, use a proper library
        const rgb1 = hexToRgb(color1) || { r: 0, g: 0, b: 0 };
        const rgb2 = hexToRgb(color2) || { r: 255, g: 255, b: 255 };
        
        const l1 = relativeLuminance(rgb1);
        const l2 = relativeLuminance(rgb2);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    };

    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const relativeLuminance = (rgb: { r: number; g: number; b: number }): number => {
        const rsRGB = rgb.r / 255;
        const gsRGB = rgb.g / 255;
        const bsRGB = rgb.b / 255;
        
        const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    // Toggle high contrast mode
    const toggleHighContrast = useCallback((): void => {
        const newHighContrast = !isHighContrast;
        setIsHighContrast(newHighContrast);
        
        if (newHighContrast) {
            document.body.classList.add('high-contrast');
            document.body.style.filter = 'contrast(1.5) brightness(1.2)';
        } else {
            document.body.classList.remove('high-contrast');
            document.body.style.filter = '';
        }
        
        setConfig(prev => ({ ...prev, enableHighContrast: newHighContrast }));
    }, [isHighContrast]);

    // Toggle large text
    const toggleLargeText = useCallback((): void => {
        const newLargeText = !isLargeText;
        setIsLargeText(newLargeText);
        
        if (newLargeText) {
            document.body.classList.add('large-text');
            document.body.style.fontSize = '120%';
        } else {
            document.body.classList.remove('large-text');
            document.body.style.fontSize = '';
        }
        
        setConfig(prev => ({ ...prev, enableLargeText: newLargeText }));
    }, [isLargeText]);

    // Toggle reduced motion
    const toggleReducedMotion = useCallback((): void => {
        const newReducedMotion = !config.enableReducedMotion;
        
        if (newReducedMotion) {
            document.body.style.setProperty('--animation-duration', '0.01ms');
            document.body.style.setProperty('--transition-duration', '0.01ms');
        } else {
            document.body.style.removeProperty('--animation-duration');
            document.body.style.removeProperty('--transition-duration');
        }
        
        setConfig(prev => ({ ...prev, enableReducedMotion: newReducedMotion }));
    }, [config.enableReducedMotion]);

    // Toggle screen reader support
    const toggleScreenReaderSupport = useCallback((): void => {
        setConfig(prev => ({ ...prev, enableScreenReaderSupport: !prev.enableScreenReaderSupport }));
    }, []);

    // Toggle keyboard navigation
    const toggleKeyboardNavigation = useCallback((): void => {
        setConfig(prev => ({ ...prev, enableKeyboardNavigation: !prev.enableKeyboardNavigation }));
    }, []);

    // Announce to screen reader
    const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
        if (!config.enableScreenReaderSupport) return;
        
        const announcement: ScreenReaderAnnouncement = {
            id: `announcement-${Date.now()}`,
            message,
            priority,
            timestamp: new Date()
        };
        
        setAnnouncements(prev => [...prev.slice(-9), announcement]);
        
        // Use appropriate live region
        const region = priority === 'assertive' ? assertiveRegionRef.current : politeRegionRef.current;
        if (region) {
            region.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
    }, [config.enableScreenReaderSupport]);

    // Check accessibility violations
    const checkAccessibility = useCallback(async (): Promise<AccessibilityViolation[]> => {
        const foundViolations: AccessibilityViolation[] = [];
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            const htmlElement = element as HTMLElement;
            
            // Check each WCAG rule
            Object.values(wcagRules).forEach(rule => {
                const violation = rule.check(htmlElement);
                if (violation) {
                    foundViolations.push(violation);
                }
            });
        });
        
        setViolations(foundViolations);
        return foundViolations;
    }, []);

    // Fix violations
    const fixViolations = useCallback(async (violationIds: string[]): Promise<void> => {
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            const htmlElement = element as HTMLElement;
            
            violationIds.forEach(violationId => {
                const violation = violations.find(v => v.id === violationId);
                if (!violation || !violation.autoFixable) return;
                
                const rule = Object.values(wcagRules).find(r => r.category === violation.category);
                if (rule) {
                    rule.fix(htmlElement);
                }
            });
        });
        
        // Re-check after fixes
        await checkAccessibility();
    }, [violations, checkAccessibility]);

    // Enable focus trap
    const enableFocusTrap = useCallback((container: HTMLElement, trapConfig?: FocusTrapConfig): (() => void) => {
        const config: FocusTrapConfig = {
            enabled: true,
            restoreFocus: true,
            escapeKey: 'Escape',
            ...trapConfig
        };
        
        focusTrapRef.current = { container, config };
        
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Set initial focus
        if (config.initialFocus) {
            const initialElement = container.querySelector(config.initialFocus) as HTMLElement;
            if (initialElement) initialElement.focus();
        } else if (firstElement) {
            firstElement.focus();
        }
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            }
            
            if (e.key === config.escapeKey) {
                disableFocusTrap();
            }
        };
        
        container.addEventListener('keydown', handleKeyDown);
        
        const disableFocusTrap = () => {
            container.removeEventListener('keydown', handleKeyDown);
            
            if (config.restoreFocus && config.finalFocus) {
                const finalElement = document.querySelector(config.finalFocus) as HTMLElement;
                if (finalElement) finalElement.focus();
            }
            
            focusTrapRef.current = null;
        };
        
        return disableFocusTrap;
    }, []);

    // Add keyboard navigation pattern
    const addKeyboardPattern = useCallback((pattern: KeyboardNavigationPattern): void => {
        keyboardPatternsRef.current.set(pattern.name, pattern);
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!pattern.enabled) return;
            
            const isMatch = pattern.keys.some(key => {
                if (key === 'Ctrl+Space') return e.ctrlKey && e.code === 'Space';
                if (key === 'Alt+ArrowDown') return e.altKey && e.code === 'ArrowDown';
                if (key.startsWith('Ctrl+')) return e.ctrlKey && e.key === key.split('+')[1];
                return e.key === key;
            });
            
            if (isMatch) {
                const target = e.target as HTMLElement;
                pattern.action(target, e);
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
    }, []);

    // Remove keyboard navigation pattern
    const removeKeyboardPattern = useCallback((name: string): void => {
        keyboardPatternsRef.current.delete(name);
    }, []);

    // Set focus indicator
    const setFocusIndicator = useCallback((element: HTMLElement, visible: boolean): void => {
        if (visible) {
            element.style.outline = '2px solid #007bff';
            element.style.outlineOffset = '2px';
        } else {
            element.style.outline = '';
            element.style.outlineOffset = '';
        }
    }, []);

    // Generate aria label
    const generateAriaLabel = useCallback((element: HTMLElement, context?: string): string => {
        const tagName = element.tagName.toLowerCase();
        const type = element.getAttribute('type');
        const placeholder = element.getAttribute('placeholder');
        const title = element.getAttribute('title');
        const textContent = element.textContent?.trim();
        
        // Generate contextual aria label based on element type and attributes
        if (tagName === 'button') {
            return textContent || title || context || 'Button';
        }
        
        if (tagName === 'input') {
            if (type === 'submit') return 'Submit button';
            if (type === 'reset') return 'Reset button';
            return placeholder || title || context || 'Input field';
        }
        
        if (tagName === 'textarea') {
            return placeholder || title || context || 'Text area';
        }
        
        if (tagName === 'select') {
            return placeholder || title || context || 'Dropdown';
        }
        
        if (tagName === 'a') {
            return textContent || title || context || 'Link';
        }
        
        return textContent || title || context || '';
    }, []);

    // Skip to content
    const skipToContent = useCallback((): void => {
        const mainContent = document.querySelector('main, [role="main"], #main') as HTMLElement;
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView();
            announceToScreenReader('Skipped to main content');
        }
    }, [announceToScreenReader]);

    // Set language
    const setLanguage = useCallback((language: string): void => {
        document.documentElement.lang = language;
        setConfig(prev => ({ ...prev, language }));
    }, []);

    // Set reading speed
    const setReadingSpeed = useCallback((speed: 'slow' | 'normal' | 'fast'): void => {
        setConfig(prev => ({ ...prev, readingSpeed: speed }));
        
        // Adjust screen reader announcement speed
        const speedMultipliers = { slow: 0.8, normal: 1, fast: 1.2 };
        document.documentElement.style.setProperty('--speech-rate', speedMultipliers[speed].toString());
    }, []);

    // Track focus changes
    useEffect(() => {
        const handleFocusIn = (e: FocusEvent) => {
            setCurrentFocusElement(e.target as HTMLElement);
            if (config.enableFocusIndicators) {
                setFocusIndicator(e.target as HTMLElement, true);
            }
        };
        
        const handleFocusOut = (e: FocusEvent) => {
            if (config.enableFocusIndicators) {
                setFocusIndicator(e.target as HTMLElement, false);
            }
        };
        
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);
        
        return () => {
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusout', handleFocusOut);
        };
    }, [config.enableFocusIndicators, setFocusIndicator]);

    // Initialize default keyboard patterns
    useEffect(() => {
        const defaultPatterns: KeyboardNavigationPattern[] = [
            {
                name: 'skipToMain',
                keys: ['Alt+M'],
                description: 'Skip to main content',
                action: () => skipToContent(),
                enabled: true
            },
            {
                name: 'toggleHighContrast',
                keys: ['Alt+H'],
                description: 'Toggle high contrast mode',
                action: () => {
                    toggleHighContrast();
                    announceToScreenReader(`High contrast ${isHighContrast ? 'disabled' : 'enabled'}`);
                },
                enabled: true
            },
            {
                name: 'toggleLargeText',
                keys: ['Alt+L'],
                description: 'Toggle large text mode',
                action: () => {
                    toggleLargeText();
                    announceToScreenReader(`Large text ${isLargeText ? 'disabled' : 'enabled'}`);
                },
                enabled: true
            },
            {
                name: 'helpMode',
                keys: ['Alt+?'],
                description: 'Activate help mode',
                action: () => {
                    announceToScreenReader('Help mode activated. Press Alt+H for high contrast, Alt+L for large text, Alt+M to skip to main content.');
                },
                enabled: true
            }
        ];
        
        defaultPatterns.forEach(pattern => {
            addKeyboardPattern(pattern);
        });
    }, [addKeyboardPattern, skipToContent, toggleHighContrast, toggleLargeText, isHighContrast, isLargeText]);

    // Check for system preferences
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        
        setConfig(prev => ({
            ...prev,
            enableReducedMotion: prefersReducedMotion.matches,
            enableHighContrast: prefersHighContrast.matches
        }));
        
        const handleMotionChange = (e: MediaQueryListEvent) => {
            setConfig(prev => ({ ...prev, enableReducedMotion: e.matches }));
        };
        
        const handleContrastChange = (e: MediaQueryListEvent) => {
            setConfig(prev => ({ ...prev, enableHighContrast: e.matches }));
        };
        
        prefersReducedMotion.addEventListener('change', handleMotionChange);
        prefersHighContrast.addEventListener('change', handleContrastChange);
        
        return () => {
            prefersReducedMotion.removeEventListener('change', handleMotionChange);
            prefersHighContrast.removeEventListener('change', handleContrastChange);
        };
    }, []);

    const value: AccessibilityEnhancerContextType = {
        config,
        violations,
        announcements,
        isHighContrast,
        isLargeText,
        currentFocusElement,
        toggleHighContrast,
        toggleLargeText,
        toggleReducedMotion,
        toggleScreenReaderSupport,
        toggleKeyboardNavigation,
        announceToScreenReader,
        checkAccessibility,
        fixViolations,
        enableFocusTrap,
        addKeyboardPattern,
        removeKeyboardPattern,
        setFocusIndicator,
        generateAriaLabel,
        skipToContent,
        setLanguage,
        setReadingSpeed
    };

    return (
        <AccessibilityEnhancerContext.Provider value={value}>
            {children}
            
            {/* Hidden live regions for screen reader announcements */}
            <div
                ref={liveRegionRef}
                className=\"sr-only\"
                aria-live=\"off\"
                aria-atomic=\"true\"
            />
            <div
                ref={politeRegionRef}
                className=\"sr-only\"
                aria-live=\"polite\"
                aria-atomic=\"true\"
            />
            <div
                ref={assertiveRegionRef}
                className=\"sr-only\"
                aria-live=\"assertive\"
                aria-atomic=\"true\"
            />
            
            {/* Skip links */}
            {config.enableSkipLinks && (
                <a
                    href=\"#main\"
                    onClick={skipToContent}
                    className=\"sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50\"
                >
                    Skip to main content
                </a>
            )}
        </AccessibilityEnhancerContext.Provider>
    );
};

// Hook to use accessibility enhancer
export const useAccessibilityEnhancer = () => {
    const context = useContext(AccessibilityEnhancerContext);
    if (!context) {
        throw new Error('useAccessibilityEnhancer must be used within AccessibilityEnhancerProvider');
    }
    return context;
};

// Accessibility Dashboard Component
interface AccessibilityDashboardProps {
    className?: string;
}

export const AccessibilityDashboard: React.FC<AccessibilityDashboardProps> = ({ 
    className = '' 
}) => {
    const { 
        config, 
        violations, 
        isHighContrast, 
        isLargeText,
        toggleHighContrast,
        toggleLargeText,
        toggleReducedMotion,
        checkAccessibility,
        fixViolations,
        announcements
    } = useAccessibilityEnhancer();

    const getViolationIcon = (type: string) => {
        switch (type) {
            case 'error': return <FiAlertTriangle className=\"text-red-500\" />;
            case 'warning': return <FiAlertTriangle className=\"text-yellow-500\" />;
            case 'info': return <FiInfo className=\"text-blue-500\" />;
            default: return <FiInfo className=\"text-gray-500\" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-700';
            case 'high': return 'bg-orange-100 text-orange-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-900\">Accessibility Enhancer</h2>
                <div className=\"flex items-center space-x-2\">
                    {isHighContrast && (
                        <div className=\"flex items-center space-x-1 text-purple-500\">
                            <FiEye />
                            <span className=\"text-sm\">High Contrast</span>
                        </div>
                    )}
                    {isLargeText && (
                        <div className=\"flex items-center space-x-1 text-blue-500\">
                            <FiZoomIn />
                            <span className=\"text-sm\">Large Text</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Settings */}
            <div className=\"mb-6 p-4 bg-gray-50 rounded-lg\">
                <h3 className=\"text-lg font-semibold mb-3\">Quick Settings</h3>
                <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
                    <button
                        onClick={toggleHighContrast}
                        className={`flex items-center space-x-2 px-3 py-2 rounded ${
                            isHighContrast ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {isHighContrast ? <FiEye /> : <FiEyeOff />}
                        <span>High Contrast</span>
                    </button>
                    
                    <button
                        onClick={toggleLargeText}
                        className={`flex items-center space-x-2 px-3 py-2 rounded ${
                            isLargeText ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {isLargeText ? <FiZoomIn /> : <FiZoomOut />}
                        <span>Large Text</span>
                    </button>
                    
                    <button
                        onClick={toggleReducedMotion}
                        className={`flex items-center space-x-2 px-3 py-2 rounded ${
                            config.enableReducedMotion ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        <FiNavigation />
                        <span>Reduced Motion</span>
                    </button>
                    
                    <button
                        onClick={checkAccessibility}
                        className=\"flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600\"
                    >
                        <FiCheck />
                        <span>Check WCAG</span>
                    </button>
                </div>
            </div>

            {/* Accessibility Violations */}
            {violations.length > 0 && (
                <div className=\"mb-6\">
                    <h3 className=\"text-lg font-semibold mb-3\">WCAG Violations ({violations.length})</h3>
                    <div className=\"space-y-2 max-h-64 overflow-y-auto\">
                        {violations.map(violation => (
                            <div key={violation.id} className=\"flex items-start space-x-3 p-3 border border-gray-200 rounded\">
                                {getViolationIcon(violation.type)}
                                <div className=\"flex-1\">
                                    <div className=\"flex items-center space-x-2 mb-1\">
                                        <span className=\"font-medium\">{violation.element}</span>
                                        <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(violation.severity)}`}>
                                            {violation.severity}
                                        </span>
                                    </div>
                                    <div className=\"text-sm text-gray-600 mb-1\">{violation.description}</div>
                                    <div className=\"text-xs text-gray-500\">{violation.wcagGuideline}</div>
                                    {violation.autoFixable && (
                                        <button
                                            onClick={() => fixViolations([violation.id])}
                                            className=\"mt-2 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600\"
                                        >
                                            Auto Fix
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Announcements */}
            {announcements.length > 0 && (
                <div className=\"mb-6\">
                    <h3 className=\"text-lg font-semibold mb-3\">Screen Reader Announcements</h3>
                    <div className=\"space-y-1 max-h-32 overflow-y-auto\">
                        {announcements.slice(-5).reverse().map(announcement => (
                            <div key={announcement.id} className=\"flex items-center justify-between p-2 bg-gray-50 rounded text-sm\">
                                <span className={announcement.priority === 'assertive' ? 'text-red-600' : 'text-blue-600'}>
                                    {announcement.message}
                                </span>
                                <span className=\"text-xs text-gray-500\">
                                    {announcement.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Configuration Status */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">Configuration Status</h3>
                <div className=\"grid grid-cols-2 md:grid-cols-3 gap-4\">
                    <div className=\"flex items-center space-x-2\">
                        <FiKeyboard className={config.enableKeyboardNavigation ? 'text-green-500' : 'text-gray-400'} />
                        <span className=\"text-sm\">Keyboard Navigation</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <FiVolume2 className={config.enableScreenReaderSupport ? 'text-green-500' : 'text-gray-400'} />
                        <span className=\"text-sm\">Screen Reader</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <FiSettings className={config.enableAriaLabels ? 'text-green-500' : 'text-gray-400'} />
                        <span className=\"text-sm\">ARIA Labels</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <FiMousePointer className={config.enableFocusIndicators ? 'text-green-500' : 'text-gray-400'} />
                        <span className=\"text-sm\">Focus Indicators</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <FiInfo className={config.enableLiveRegions ? 'text-green-500' : 'text-gray-400'} />
                        <span className=\"text-sm\">Live Regions</span>
                    </div>
                    <div className=\"flex items-center space-x-2\">
                        <FiNavigation className={config.enableSkipLinks ? 'text-green-500' : 'text-gray-400'} />
                        <span className=\"text-sm\">Skip Links</span>
                    </div>
                </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">Keyboard Shortcuts</h3>
                <div className=\"space-y-1 text-sm\">
                    <div className=\"flex justify-between p-2 bg-gray-50 rounded\">
                        <span>Skip to main content</span>
                        <kbd className=\"px-2 py-1 bg-white border border-gray-300 rounded\">Alt+M</kbd>
                    </div>
                    <div className=\"flex justify-between p-2 bg-gray-50 rounded\">
                        <span>Toggle high contrast</span>
                        <kbd className=\"px-2 py-1 bg-white border border-gray-300 rounded\">Alt+H</kbd>
                    </div>
                    <div className=\"flex justify-between p-2 bg-gray-50 rounded\">
                        <span>Toggle large text</span>
                        <kbd className=\"px-2 py-1 bg-white border border-gray-300 rounded\">Alt+L</kbd>
                    </div>
                    <div className=\"flex justify-between p-2 bg-gray-50 rounded\">
                        <span>Help mode</span>
                        <kbd className=\"px-2 py-1 bg-white border border-gray-300 rounded\">Alt+?</kbd>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityEnhancerProvider;
