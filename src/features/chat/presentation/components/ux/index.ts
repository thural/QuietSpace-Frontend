/**
 * UX Enhancement Components Index
 * 
 * This file exports all UX enhancement components and utilities for easy importing
 * throughout the chat feature.
 */

// Main UX Enhancement Components
export { default as AdvancedAnimationManagerProvider } from './AdvancedAnimationManager';
export { default as AccessibilityEnhancerProvider } from './AccessibilityEnhancer';
export { default as MobileEnhancerProvider } from './MobileEnhancer';
export { default as ThemeEnhancerProvider } from './ThemeEnhancer';

// Re-export for convenience
export {
    AdvancedAnimationManagerProvider as ChatAdvancedAnimationManagerProvider,
    AccessibilityEnhancerProvider as ChatAccessibilityEnhancerProvider,
    MobileEnhancerProvider as ChatMobileEnhancerProvider,
    ThemeEnhancerProvider as ChatThemeEnhancerProvider
} from './ThemeEnhancer';

// Dashboard Components
export { AnimationDashboard } from './AdvancedAnimationManager';
export { AccessibilityDashboard } from './AccessibilityEnhancer';
export { MobileDashboard } from './MobileEnhancer';
export { ThemeDashboard } from './ThemeEnhancer';

// Types and Interfaces
export type { 
    AnimationConfig, 
    PerformanceMetrics, 
    MicroInteraction, 
    AnimationDefinition, 
    InteractionTrigger,
    AnimationPreset 
} from './AdvancedAnimationManager';

export type { 
    AccessibilityConfig, 
    AccessibilityViolation, 
    FocusTrapConfig,
    KeyboardNavigationPattern,
    ScreenReaderAnnouncement 
} from './AccessibilityEnhancer';

export type { 
    MobileConfig, 
    TouchGesture, 
    MobileViewport, 
    MobileOptimization,
    SwipeNavigation 
} from './MobileEnhancer';

export type { 
    ThemeConfig, 
    Theme, 
    ThemeColors, 
    ThemeTypography,
    ThemeSpacing,
    ThemeBorders,
    ThemeShadows,
    ThemeTransitions 
} from './ThemeEnhancer';

// Hooks
export { useAdvancedAnimationManager } from './AdvancedAnimationManager';
export { useAccessibilityEnhancer } from './AccessibilityEnhancer';
export { useMobileEnhancer } from './MobileEnhancer';
export { useThemeEnhancer } from './ThemeEnhancer';

// Utilities
export const UXEnhancementUtils = {
    // Animation utilities
    createAnimation: (definition: any) => {
        return {
            id: `animation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...definition
        };
    },
    
    // Accessibility utilities
    checkWCAGCompliance: () => {
        // Simplified WCAG compliance check
        const violations = [];
        
        // Check for common accessibility issues
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (!img.alt) {
                violations.push({
                    element: `img[${index}]`,
                    issue: 'Missing alt text',
                    severity: 'error',
                    suggestion: 'Add descriptive alt text'
                });
            }
        });
        
        return violations;
    },
    
    generateAriaLabel: (element: HTMLElement, context?: string) => {
        const tag = element.tagName.toLowerCase();
        const placeholder = element.getAttribute('placeholder');
        const title = element.getAttribute('title');
        const textContent = element.textContent?.trim();
        
        if (tag === 'button') {
            return textContent || title || context || 'Button';
        }
        
        if (tag === 'input') {
            return placeholder || title || context || 'Input field';
        }
        
        return textContent || title || context || '';
    },
    
    // Mobile utilities
    detectMobileDevice: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    getViewportInfo: () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
            pixelRatio: window.devicePixelRatio || 1
        };
    },
    
    // Theme utilities
    generateColorPalette: (baseColor: string) => {
        const hex = baseColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        return {
            primary: baseColor,
            secondary: `#${Math.max(0, r - 30).toString(16).padStart(2, '0')}${Math.max(0, g - 30).toString(16).padStart(2, '0')}${Math.max(0, b - 30).toString(16).padStart(2, '0')}`,
            accent: `#${Math.min(255, r + 30).toString(16).padStart(2, '0')}${Math.min(255, g + 30).toString(16).padStart(2, '0')}${Math.min(255, b + 30).toString(16).padStart(2, '0')}`,
            background: '#ffffff',
            surface: '#f8fafc',
            text: '#1e293b',
            textSecondary: '#64748b',
            textInverse: '#ffffff',
            border: '#e2e8f0',
            error: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981',
            info: baseColor
        };
    },
    
    // Performance utilities
    optimizeForDevice: () => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            document.body.classList.add('mobile-optimized');
            // Apply mobile-specific optimizations
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        }
    },
    
    // Integration utilities
    initializeUXEnhancements: () => {
        // Initialize all UX enhancements
        console.log('Initializing UX enhancements...');
        
        // Check for system preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Apply system preferences
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
        }
        
        if (prefersDarkMode.matches) {
            document.body.classList.add('dark-mode');
        }
        
        // Add viewport meta tag for mobile
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
        
        console.log('UX enhancements initialized');
    }
};

export default UXEnhancementUtils;
