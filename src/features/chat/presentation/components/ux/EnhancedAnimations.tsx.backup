/**
 * Enhanced Animations System
 * 
 * This module provides a comprehensive animation system with smooth transitions,
 * micro-interactions, and customizable animation presets for the chat feature.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    FiMessageSquare, 
    FiSend, 
    FiUser, 
    FiUsers, 
    FiActivity,
    FiCheck,
    FiX,
    FiLoader,
    FiRefreshCw,
    FiChevronDown,
    FiChevronUp,
    FiMoreVertical,
    FiBell,
    FiSettings,
    FiSearch,
    FiPlus
} from 'react-icons/fi';

// Animation types
export interface AnimationConfig {
    duration: number;
    easing: string;
    delay?: number;
    fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
}

export interface AnimationPreset {
    name: string;
    config: AnimationConfig;
    className: string;
}

export interface AnimationState {
    isAnimating: boolean;
    currentAnimation: string | null;
    animations: Map<string, AnimationConfig>;
}

// Animation presets
export const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
    // Fast animations for responsive interactions
    fast: {
        name: 'fast',
        config: {
            duration: 150,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fillMode: 'forwards'
        },
        className: 'animate-fast'
    },
    
    // Smooth animations for general transitions
    smooth: {
        name: 'smooth',
        config: {
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fillMode: 'forwards'
        },
        className: 'animate-smooth'
    },
    
    // Bouncy animations for playful interactions
    bouncy: {
        name: 'bouncy',
        config: {
            duration: 500,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            fillMode: 'forwards'
        },
        className: 'animate-bouncy'
    },
    
    // Slide animations for panel transitions
    slideIn: {
        name: 'slideIn',
        config: {
            duration: 400,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fillMode: 'forwards'
        },
        className: 'animate-slideIn'
    },
    
    // Fade animations for content transitions
    fadeIn: {
        name: 'fadeIn',
        config: {
            duration: 200,
            easing: 'ease-in-out',
            fillMode: 'forwards'
        },
        className: 'animate-fadeIn'
    },
    
    // Scale animations for emphasis
    scale: {
        name: 'scale',
        config: {
            duration: 200,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            fillMode: 'forwards'
        },
        className: 'animate-scale'
    },
    
    // Pulse animations for attention
    pulse: {
        name: 'pulse',
        config: {
            duration: 1000,
            easing: 'ease-in-out',
            fillMode: 'forwards'
        },
        className: 'animate-pulse'
    },
    
    // Shake animations for errors
    shake: {
        name: 'shake',
        config: {
            duration: 500,
            easing: 'ease-in-out',
            fillMode: 'forwards'
        },
        className: 'animate-shake'
    },
    
    // Loading animations
    loading: {
        name: 'loading',
        config: {
            duration: 1500,
            easing: 'linear',
            fillMode: 'infinite'
        },
        className: 'animate-loading'
    }
};

// CSS-in-JS animation utilities
export const createAnimationCSS = (config: AnimationConfig): string => {
    const { duration, easing, delay = 0, fillMode = 'forwards' } = config;
    
    return `
        animation-duration: ${duration}ms;
        animation-timing-function: ${easing};
        animation-delay: ${delay}ms;
        animation-fill-mode: ${fillMode};
    `;
};

// Animation context
interface AnimationContextType {
    animations: Map<string, AnimationConfig>;
    isReducedMotion: boolean;
    registerAnimation: (name: string, config: AnimationConfig) => void;
    getAnimation: (name: string) => AnimationConfig | undefined;
    setReducedMotion: (reduced: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

// Animation Provider
interface AnimationProviderProps {
    children: ReactNode;
    defaultAnimations?: Record<string, AnimationConfig>;
    respectReducedMotion?: boolean;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({
    children,
    defaultAnimations = {},
    respectReducedMotion = true
}) => {
    const [animations, setAnimations] = useState<Map<string, AnimationConfig>>(new Map());
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    // Register default animations
    useEffect(() => {
        const defaultMap = new Map(Object.entries({
            ...Object.fromEntries(
                Object.entries(ANIMATION_PRESETS).map(([key, preset]) => [key, preset.config])
            ),
            ...defaultAnimations
        }));
        setAnimations(defaultMap);
    }, [defaultAnimations]);

    // Respect system reduced motion preference
    useEffect(() => {
        if (respectReducedMotion) {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            const handleChange = (e: MediaQueryListEvent) => {
                setIsReducedMotion(e.matches);
            };
            
            mediaQuery.addEventListener('change', handleChange);
            setIsReducedMotion(mediaQuery.matches);
            
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }
    }, [respectReducedMotion]);

    const registerAnimation = (name: string, config: AnimationConfig) => {
        setAnimations(prev => new Map(prev).set(name, config));
    };

    const getAnimation = (name: string) => {
        return animations.get(name);
    };

    const setReducedMotion = (reduced: boolean) => {
        setIsReducedMotion(reduced);
    };

    const value: AnimationContextType = {
        animations,
        isReducedMotion,
        registerAnimation,
        getAnimation,
        setReducedMotion
    };

    return (
        <AnimationContext.Provider value={value}>
            {children}
        </AnimationContext.Provider>
    );
};

// Hook to use animations
export const useAnimations = () => {
    const context = useContext(AnimationContext);
    if (!context) {
        throw new Error('useAnimations must be used within AnimationProvider');
    }
    return context;
};

// Animation component for applying animations
interface AnimatedProps {
    children: ReactNode;
    animation: string | AnimationConfig;
    className?: string;
    style?: React.CSSProperties;
    onAnimationStart?: () => void;
    onAnimationEnd?: () => void;
    trigger?: boolean;
}

export const Animated: React.FC<AnimatedProps> = ({
    children,
    animation,
    className = '',
    style = {},
    onAnimationStart,
    onAnimationEnd,
    trigger = true
}) => {
    const { getAnimation, isReducedMotion } = useAnimations();
    const [isAnimating, setIsAnimating] = useState(false);

    const animationConfig = typeof animation === 'string' ? getAnimation(animation) : animation;

    useEffect(() => {
        if (!trigger || isReducedMotion || !animationConfig) {
            return;
        }

        setIsAnimating(true);
        onAnimationStart?.();

        const timer = setTimeout(() => {
            setIsAnimating(false);
            onAnimationEnd?.();
        }, animationConfig.duration + (animationConfig.delay || 0));

        return () => clearTimeout(timer);
    }, [trigger, animationConfig, isReducedMotion, onAnimationStart, onAnimationEnd]);

    const animationStyle = animationConfig ? createAnimationCSS(animationConfig) : '';

    return (
        <div
            className={`${className} ${isAnimating ? animationConfig.className || ''}`}
            style={{
                ...style,
                ...(animationStyle && { animation: 'none', ...animationStyle })
            }}
        >
            {children}
        </div>
    );
};

// Pre-built animation components
export const AnimatedMessage: React.FC<{ children: ReactNode; className?: string }> = ({ 
    children, 
    className = '' 
}) => (
    <Animated animation="slideIn" className={className}>
        {children}
    </Animated>
);

export const AnimatedButton: React.FC<{ 
    children: ReactNode; 
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
}> = ({ 
    children, 
    className = '',
    variant = 'primary'
}) => {
    const baseClasses = variant === 'primary' 
        ? 'bg-blue-600 text-white hover:bg-blue-700' 
        : variant === 'secondary'
        ? 'bg-gray-600 text-white hover:bg-gray-700'
        : 'bg-transparent text-gray-700 hover:bg-gray-100';

    return (
        <Animated 
            animation="scale" 
            className={`${baseClasses} ${className} px-4 py-2 rounded-lg transition-colors`}
        >
            {children}
        </Animated>
    );
};

export const AnimatedIcon: React.FC<{ 
    icon: React.ReactNode;
    className?: string;
    animation?: string;
    size?: 'sm' | 'md' | 'lg';
}> = ({ 
    icon, 
    className = '',
    animation = 'pulse',
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <Animated 
            animation={animation}
            className={`${sizeClasses[size]} ${className} flex items-center justify-center`}
        >
            {icon}
        </Animated>
    );
};

export const AnimatedLoader: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
    className = '',
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <Animated 
            animation="loading"
            className={`${sizeClasses[size]} ${className}`}
        >
            <FiLoader className="w-full h-full" />
        </Animated>
    );
};

// Micro-interaction components
export const InteractiveIcon: React.FC<{
    icon: React.ReactNode;
    className?: string;
    hoverAnimation?: string;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}> = ({ 
    icon, 
    className = '',
    hoverAnimation = 'scale',
    size = 'md',
    onClick
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <div
            className={`${sizeClasses[size]} ${className} flex items-center justify-center cursor-pointer transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <Animated animation={isHovered ? hoverAnimation : undefined}>
                {icon}
            </Animated>
        </div>
    );
};

// Transition components
export const SlideTransition: React.FC<{
    children: ReactNode;
    show: boolean;
    direction?: 'up' | 'down' | 'left' | 'right';
    duration?: number;
    className?: string;
}> = ({ 
    children, 
    show, 
    direction = 'up',
    duration = 300,
    className = ''
}) => {
    const getSlideAnimation = () => {
        const animations = {
            up: 'translateY(-10px)',
            down: 'translateY(10px)',
            left: 'translateX(-10px)',
            right: 'translateX(10px)'
        };
        
        return animations[direction] || animations.up;
    };

    return (
        <div
            className={`transition-all duration-${duration} ${show ? 'opacity-100' : 'opacity-0'} ${className}`}
            style={{
                transform: show ? 'translateY(0)' : getSlideAnimation()
            }}
        >
            {children}
        </div>
    );
};

export const FadeTransition: React.FC<{
    children: ReactNode;
    show: boolean;
    duration?: number;
    className?: string;
}> = ({ 
    children, 
    show, 
    duration = 200,
    className = ''
}) => {
    return (
        <div
            className={`transition-opacity duration-${duration} ${show ? 'opacity-100' : 'opacity-0'} ${className}`}
        >
            {children}
        </div>
    );
};

// Animation utilities
export const createStaggeredAnimation = (delay: number = 100) => {
    return (index: number) => ({
        delay: index * delay,
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fillMode: 'forwards'
    });
};

export const createSequenceAnimation = (animations: string[], interval: number = 200) => {
    return animations.map((animation, index) => ({
        animation,
        delay: index * interval,
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fillMode: 'forwards'
    }));
};

// CSS animation classes
export const animationCSS = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from { 
            opacity: 0;
            transform: translateY(20px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInLeft {
        from { 
            opacity: 0;
            transform: translateX(-20px);
        }
        to { 
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInRight {
        from { 
            opacity: 0;
            transform: translateX(20px);
        }
        to { 
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes scale {
        0% { transform: scale(0.9); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
        }
        40%, 43% {
            transform: translateY(-10px);
        }
        70% {
            transform: translateY(-5px);
        }
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }

    @keyframes loading {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .animate-fast {
        animation-duration: 150ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        animation-fill-mode: forwards;
    }

    .animate-smooth {
        animation-duration: 300ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        animation-fill-mode: forwards;
    }

    .animate-bouncy {
        animation-duration: 500ms;
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
        animation-fill-mode: forwards;
    }

    .animate-slideIn {
        animation-name: slideIn;
        animation-duration: 400ms;
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation-fill-mode: forwards;
    }

    .animate-fadeIn {
        animation-name: fadeIn;
        animation-duration: 200ms;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
    }

    .animate-scale {
        animation-name: scale;
        animation-duration: 200ms;
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
        animation-fill-mode: forwards;
    }

    .animate-pulse {
        animation-name: pulse;
        animation-duration: 1000ms;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
    }

    .animate-shake {
        animation-name: shake;
        animation-duration: 500ms;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
    }

    .animate-loading {
        animation-name: loading;
        animation-duration: 1500ms;
        animation-timing-function: linear;
        animation-fill-mode: infinite;
    }

    .transition-fast {
        transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .transition-smooth {
        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .transition-bouncy {
        transition: all 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .hover-lift {
        transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hover-lift:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .hover-scale {
        transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hover-scale:hover {
        transform: scale(1.05);
    }

    .hover-glow {
        transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hover-glow:hover {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }

    @media (prefers-reduced-motion: reduce) {
        .animate-fast,
        .animate-smooth,
        .animate-bouncy,
        .animate-slideIn,
        .animate-fadeIn,
        .animate-scale,
        .animate-pulse,
        .animate-shake,
        .animate-loading,
        .transition-fast,
        .transition-smooth,
        .transition-bouncy,
        .hover-lift,
        .hover-scale,
        .hover-glow {
            animation: none;
            transition: none;
        }
    }
`;

export default {
    AnimationProvider,
    Animated,
    AnimatedMessage,
    AnimatedButton,
    AnimatedIcon,
    AnimatedLoader,
    InteractiveIcon,
    SlideTransition,
    FadeTransition,
    ANIMATION_PRESETS,
    createStaggeredAnimation,
    createSequenceAnimation,
    animationCSS
};
