/**
 * UX Components Index
 * 
 * This file exports all UX-related components and utilities for easy importing
 * throughout the chat feature.
 */

// Main UX Components
export { default as EnhancedAnimations } from './EnhancedAnimations';
export { default as AccessibilityImprovements } from './AccessibilityImprovements';
export { default as MobileOptimization } from './MobileOptimization';
export { default as ThemeCustomization } from './ThemeCustomization';

// Re-export for convenience
export {
    // Enhanced Animations
    EnhancedAnimations as ChatEnhancedAnimations,
    
    // Accessibility Improvements
    AccessibilityImprovements as ChatAccessibilityImprovements,
    
    // Mobile Optimization
    MobileOptimization as ChatMobileOptimization,
    
    // Theme Customization
    ThemeCustomization as ChatThemeCustomization,
    
    // Animation Presets
    ANIMATION_PRESETS as ChatAnimationPresets,
    
    // Animation Utilities
    {
        createStaggeredAnimation,
        createSequenceAnimation,
        animationCSS
    } from './EnhancedAnimations'
};

// Animation presets for chat-specific use
export const ChatAnimationPresets = {
    messageSlideIn: {
        name: 'messageSlideIn',
        config: {
            duration: 300,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fillMode: 'forwards'
        },
        className: 'animate-message-slide-in'
    },
    
    messageBubble: {
        name: 'messageBubble',
        config: {
            duration: 200,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            fillMode: 'forwards'
        },
        className: 'animate-message-bubble'
    },
    
    typingIndicator: {
        name: 'typingIndicator',
        config: {
            duration: 500,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fillMode: 'infinite'
        },
        className: 'animate-typing-indicator'
    },
    
    notificationSlideIn: {
        name: 'notificationSlideIn',
        config: {
            duration: 400,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fillMode: 'forwards'
        },
        className: 'animate-notification-slide-in'
    },
    
    buttonPress: {
        name: 'buttonPress',
        config: {
            duration: 150,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            fillMode: 'forwards'
        },
        className: 'animate-button-press'
    },
    
    errorShake: {
        name: 'errorShake',
        config: {
            duration: 500,
            easing: 'ease-in-out',
            fillMode: 'forwards'
        },
        className: 'animate-error-shake'
    }
};

// Accessibility presets for chat-specific use
export const ChatAccessibilityPresets = {
    skipLinks: [
        { href: '#chat-main', label: 'Skip to chat main content' },
        { href: '#chat-sidebar', label: 'Skip to chat sidebar' },
        { href: '#chat-messages', label: 'Skip to messages' },
        { href: '#chat-input', label: 'Skip to chat input' }
    ],
    
    keyboardShortcuts: [
        { shortcut: 'Alt+C', description: 'Compose new message' },
        { shortcut: 'Alt+N', description: 'Next chat' },
        { shortcut: 'Alt+P', description: 'Previous chat' },
        { shortcut: 'Alt+/', description: 'Toggle search' },
        { shortcut: 'Alt+H', description: 'Show help' }
    ],
    
    ariaLabels: {
        messageInput: 'Type your message and press Enter to send',
        sendMessageButton: 'Send message',
        attachmentButton: 'Add attachment',
        emojiButton: 'Add emoji',
        voiceMessageButton: 'Send voice message'
    },
    
    focusManagement: {
        trapFocus: true,
        restoreFocus: true,
        cycleThroughElements: true
    }
};

// Mobile presets for chat-specific use
export const ChatMobilePresets = {
    gestures: {
        swipeLeft: { threshold: 50, action: 'navigatePrevious' },
        swipeRight: { threshold: 50, action: 'navigateNext' },
        swipeUp: { threshold: 100, action: 'navigateUp' },
        swipeDown: { threshold: 100, action: 'navigateDown' },
        longPress: { threshold: 500, action: 'showOptions' },
        doubleTap: { threshold: 300, action: 'reactToMessage' }
    },
    
    navigation: {
        sidebar: { threshold: 0, action: 'toggleSidebar' },
        search: { threshold: 0, action: 'toggleSearch' },
        menu: { threshold: 0, action: 'toggleMenu' },
        keyboard: { threshold: 0, action: 'toggleKeyboard' }
    },
    
    optimizations: {
        imageLazyLoading: true,
        touchOptimized: true,
        reducedMotion: true,
        highContrast: false,
        largeText: false
    }
};

// Theme presets for chat-specific use
export const ChatThemePresets = {
    light: THEMES.light,
    dark: THEMES.dark,
    ocean: THEMES.ocean,
    forest: THEMES.forest,
    sunset: THEMES.sunset,
    highContrast: THEMES['high-contrast']
};

// Component styling utilities
export const ChatStyling = {
    // Message bubble styles
    messageBubble: {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        padding: '8px 12px',
        margin: '4px 0',
        borderRadius: '18px',
        maxWidth: '70%',
        wordWrap: 'break-word',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
    },
    
    messageBubbleSent: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-contrast)',
        marginLeft: 'auto',
        marginRight: '4px',
        position: 'relative',
        overflow: 'hidden',
        maxHeight: '100px',
        overflow: 'auto',
        wordWrap: 'break-word',
        borderRadius: '18px',
        border: 'none',
        boxShadow: 'var(--shadow-sm)',
        transform: 'scale(0.98)',
        opacity: '0',
        transformOrigin: 'left center'
    },
    
    messageBubbleReceived: {
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
        marginLeft: 'auto',
        marginRight: '4px',
        position: 'relative',
        overflow: 'hidden',
        maxHeight: '100px',
        overflow: 'auto',
        wordWrap: 'break-word',
        borderRadius: '18px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        transform: 'scale(0.98)',
        opacity: '0',
        transformOrigin: 'right center'
    },
    
    messageInput: {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
        fontSize: 'var(--font-size-md)',
        transition: 'all 0.2s ease-in-out',
        outline: 'none',
        resize: 'none',
        fontFamily: 'var(--font-family)',
        '&:focus': {
            outline: '2px solid var(--color-primary)',
            outlineOffset: '2px',
            outlineOffset: '2px'
        }
    },
    
    messageInputFocused: {
        borderColor: 'var(--color-primary)',
        boxShadow: '0 0 0 0 3px rgba(59, 130, 246, 0.2)',
    },
    
    sendButton: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-contrast)',
        padding: '12px 20px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        fontFamily: 'var(--font-family)',
        fontWeight: 'var(--font-weight-medium)',
        '&:hover': {
            backgroundColor: 'var(--color-primary-dark)',
            transform: 'scale(1.05)',
        }
    },
    
    attachmentButton: {
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-secondary)',
        padding: '8px 12px',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: 'var(--color-primary)',
            color: 'var(--primary-contrast)',
            transform: 'scale(1.05)',
        }
    },
    
    emojiButton: {
        backgroundColor: 'transparent',
        color: 'var(--color-text-secondary)',
        padding: '8px 12px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-primary-10)',
            color: 'var(--primary-contrast)'
        }
    },
    
    voiceButton: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--primary-contrast)',
        padding: '8px 12px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:active': {
            backgroundColor: 'var(--color-primary-dark)',
            transform: 'scale(0.95)',
        }
    }
};

export default ChatStyling;

// Responsive design utilities
export const ChatResponsiveDesign = {
    mobile: {
        fontSize: '0.875rem',
        padding: '0.75rem',
        margin: '0.5rem',
        borderRadius: '12px',
        gap: '0.5rem'
    },
    tablet: {
        fontSize: '1rem',
        padding: '1rem',
        margin: '1rem',
        borderRadius: '16px',
        gap: '1rem'
    },
    desktop: {
        fontSize: '1.125rem',
        padding: '1.5rem',
        margin: '1.5rem',
        borderRadius: '20px',
        gap: '1.5rem'
    }
};

export default ChatResponsiveDesign;

// Micro-interaction utilities
export const ChatMicroInteractions = {
    hover: {
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:active': {
            transform: 'scale(0.98)',
        }
    },
    focus: {
        outline: '2px solid var(--color-primary)',
            outlineOffset: '2px'
        },
    },
    press: {
        transform: 'scale(0.95)',
        transition: 'all 0.1s ease-in-out'
    },
    disabled: {
        opacity: 0.5',
        cursor: 'not-allowed',
        pointer-events: 'none'
    }
};

// Loading states
export const ChatLoadingStates = {
    skeleton: {
        background: 'linear-gradient(90deg, #f0f0f0, #e0e0e0)',
        backgroundSize: '200% 100%',
        backgroundPosition: '0% 0%',
        backgroundRepeat: 'repeat',
        animation: skeleton-loading 1.5s linear infinite',
        backgroundSize: '200px 100%',
        backgroundPosition: '0% 0%'
    },
    spinner: {
        display: 'flex',
        justify: 'center',
        align-items: 'center',
        height: '100%',
        minHeight: '200px'
    },
    pulse: {
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }
};

export default ChatLoadingStates;

// Animation utilities
export const ChatAnimationUtils = {
    createStaggeredAnimation: (delay: number = 100) => ({
        delay: (index: number) => ({
            delay: index * delay,
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fillMode: 'forwards'
        })
    }),
    
    createSequenceAnimation: (animations: Array<{ name: string; duration?: number; delay?: number }>) => ({
        animations: animations.map((anim, index) => ({
            animation: anim.name,
            delay: anim.delay || (index * 100),
            duration: anim.duration || 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fillMode: 'forwards'
        }))
    }),
    
    createAnimationCSS: (config: AnimationConfig) => ({
        animationDuration: config.duration,
        animationTiming: config.easing,
        animationDelay: config.delay || 0,
        animationFillMode: config.fillMode || 'forwards'
    })
};

export default {
    ChatEnhancedAnimations,
    ChatAccessibilityImprovements,
    MobileOptimization,
    ThemeCustomization,
    THEMES,
    ChatAnimationPresets,
    ChatAccessibilityPresets,
    ChatMobilePresets,
    ChatThemePresets,
    ChatStyling,
    ChatResponsiveDesign,
    ChatMicroInteractions,
    ChatLoadingStates,
    ChatAnimationUtils
};
