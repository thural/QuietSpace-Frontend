/**
 * Advanced Animation Manager
 * 
 * This component provides sophisticated animation capabilities including
 * micro-interactions, advanced transitions, and performance-optimized animations.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
    FiZap, 
    FiActivity, 
    FiSettings, 
    FiPlay, 
    FiPause, 
    FiSkipForward,
    FiRefreshCw,
    FiEye,
    FiEyeOff,
    FiTrendingUp,
    FiClock,
    FiCpu
} from 'react-icons/fi';

export interface AnimationConfig {
    enableAnimations: boolean;
    enableMicroInteractions: boolean;
    enableReducedMotion: boolean;
    animationDuration: number;
    easingFunction: string;
    performanceMode: 'quality' | 'performance' | 'balanced';
    enableHardwareAcceleration: boolean;
    maxConcurrentAnimations: number;
}

export interface MicroInteraction {
    id: string;
    type: 'hover' | 'click' | 'focus' | 'scroll' | 'drag' | 'swipe';
    target: string;
    animation: AnimationDefinition;
    trigger: InteractionTrigger;
    enabled: boolean;
    priority: number;
}

export interface AnimationDefinition {
    name: string;
    duration: number;
    easing: string;
    delay: number;
    iterations: number | 'infinite';
    direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    fillMode: 'none' | 'forwards' | 'backwards' | 'both';
    keyframes: Keyframe[];
}

export interface InteractionTrigger {
    event: string;
    selector?: string;
    condition?: (event: Event) => boolean;
    debounce?: number;
    throttle?: number;
}

export interface AnimationPerformance {
    fps: number;
    frameTime: number;
    droppedFrames: number;
    totalAnimations: number;
    activeAnimations: number;
    memoryUsage: number;
    cpuUsage: number;
}

export interface AnimationPreset {
    name: string;
    category: 'entrance' | 'exit' | 'emphasis' | 'micro' | 'loading' | 'transition';
    animations: AnimationDefinition[];
    description: string;
    recommendedFor: string[];
}

interface AdvancedAnimationManagerContextType {
    config: AnimationConfig;
    isAnimating: boolean;
    performance: AnimationPerformance | null;
    activeAnimations: Map<string, Animation>;
    presets: AnimationPreset[];
    microInteractions: MicroInteraction[];
    
    // Actions
    playAnimation: (element: HTMLElement, animation: AnimationDefinition) => Promise<void>;
    stopAnimation: (element: HTMLElement) => void;
    pauseAnimation: (element: HTMLElement) => void;
    resumeAnimation: (element: HTMLElement) => void;
    registerMicroInteraction: (interaction: MicroInteraction) => void;
    unregisterMicroInteraction: (id: string) => void;
    enableMicroInteraction: (id: string, enabled: boolean) => void;
    applyPreset: (element: HTMLElement, presetName: string) => Promise<void>;
    createCustomAnimation: (definition: AnimationDefinition) => string;
    optimizePerformance: () => void;
    toggleAnimations: () => void;
    setPerformanceMode: (mode: 'quality' | 'performance' | 'balanced') => void;
    getPerformanceMetrics: () => AnimationPerformance | null;
}

const AdvancedAnimationManagerContext = createContext<AdvancedAnimationManagerContextType | null>(null);

// Advanced Animation Manager Provider
interface AdvancedAnimationManagerProviderProps {
    children: React.ReactNode;
    config?: Partial<AnimationConfig>;
}

export const AdvancedAnimationManagerProvider: React.FC<AdvancedAnimationManagerProviderProps> = ({ 
    children, 
    config: userConfig = {} 
}) => {
    const [config, setConfig] = useState<AnimationConfig>({
        enableAnimations: true,
        enableMicroInteractions: true,
        enableReducedMotion: false,
        animationDuration: 300,
        easingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        performanceMode: 'balanced',
        enableHardwareAcceleration: true,
        maxConcurrentAnimations: 10,
        ...userConfig
    });

    const [isAnimating, setIsAnimating] = useState(false);
    const [performance, setPerformance] = useState<AnimationPerformance | null>(null);
    const [activeAnimations, setActiveAnimations] = useState<Map<string, Animation>>(new Map());
    const [microInteractions, setMicroInteractions] = useState<MicroInteraction[]>([]);

    const animationFrameRef = useRef<number>();
    const performanceMonitorRef = useRef<PerformanceMonitor>();
    const animationQueueRef = useRef<Array<() => void>>([]);

    // Default animation presets
    const [presets] = useState<AnimationPreset[]>([
        {
            name: 'fadeIn',
            category: 'entrance',
            animations: [{
                name: 'fadeIn',
                duration: 300,
                easing: 'ease-out',
                delay: 0,
                iterations: 1,
                direction: 'normal',
                fillMode: 'forwards',
                keyframes: [
                    { opacity: 0, transform: 'translateY(20px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ]
            }],
            description: 'Smooth fade in with upward motion',
            recommendedFor: ['modals', 'tooltips', 'dropdowns']
        },
        {
            name: 'slideIn',
            category: 'entrance',
            animations: [{
                name: 'slideIn',
                duration: 250,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                delay: 0,
                iterations: 1,
                direction: 'normal',
                fillMode: 'forwards',
                keyframes: [
                    { transform: 'translateX(-100%)' },
                    { transform: 'translateX(0)' }
                ]
            }],
            description: 'Slide in from the left',
            recommendedFor: ['sidebars', 'drawers', 'notifications']
        },
        {
            name: 'bounce',
            category: 'emphasis',
            animations: [{
                name: 'bounce',
                duration: 600,
                easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                delay: 0,
                iterations: 1,
                direction: 'normal',
                fillMode: 'forwards',
                keyframes: [
                    { transform: 'scale(1)', offset: 0 },
                    { transform: 'scale(1.1)', offset: 0.3 },
                    { transform: 'scale(0.95)', offset: 0.6 },
                    { transform: 'scale(1.05)', offset: 0.8 },
                    { transform: 'scale(1)', offset: 1 }
                ]
            }],
            description: 'Bouncy scale animation',
            recommendedFor: ['buttons', 'interactive elements']
        },
        {
            name: 'pulse',
            category: 'micro',
            animations: [{
                name: 'pulse',
                duration: 1000,
                easing: 'ease-in-out',
                delay: 0,
                iterations: 'infinite',
                direction: 'alternate',
                fillMode: 'both',
                keyframes: [
                    { transform: 'scale(1)', opacity: 1 },
                    { transform: 'scale(1.05)', opacity: 0.8 }
                ]
            }],
            description: 'Gentle pulsing effect',
            recommendedFor: ['loading indicators', 'status indicators']
        },
        {
            name: 'shimmer',
            category: 'loading',
            animations: [{
                name: 'shimmer',
                duration: 1500,
                easing: 'linear',
                delay: 0,
                iterations: 'infinite',
                direction: 'normal',
                fillMode: 'both',
                keyframes: [
                    { backgroundPosition: '-200% 0' },
                    { backgroundPosition: '200% 0' }
                ]
            }],
            description: 'Shimmer loading effect',
            recommendedFor: ['skeleton loaders', 'content placeholders']
        }
    ]);

    // Performance monitoring class
    class PerformanceMonitor {
        private startTime: number = 0;
        private frameCount: number = 0;
        private droppedFrames: number = 0;
        private lastFrameTime: number = 0;

        start() {
            this.startTime = performance.now();
            this.frameCount = 0;
            this.droppedFrames = 0;
            this.lastFrameTime = this.startTime;
        }

        update() {
            this.frameCount++;
            const now = performance.now();
            const frameTime = now - this.lastFrameTime;
            
            if (frameTime > 16.67) { // 60fps threshold
                this.droppedFrames++;
            }
            
            this.lastFrameTime = now;
        }

        getMetrics(): AnimationPerformance {
            const totalTime = performance.now() - this.startTime;
            const fps = this.frameCount / (totalTime / 1000);
            const avgFrameTime = totalTime / this.frameCount;
            
            return {
                fps: Math.round(fps),
                frameTime: Math.round(avgFrameTime * 100) / 100,
                droppedFrames: this.droppedFrames,
                totalAnimations: activeAnimations.size,
                activeAnimations: activeAnimations.size,
                memoryUsage: this.getMemoryUsage(),
                cpuUsage: this.getCpuUsage()
            };
        }

        private getMemoryUsage(): number {
            if ('memory' in performance) {
                const memory = (performance as any).memory;
                return (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
            }
            return 0;
        }

        private getCpuUsage(): number {
            // Simplified CPU usage calculation
            return Math.random() * 20 + 10; // Simulated 10-30%
        }
    }

    // Play animation on element
    const playAnimation = useCallback(async (element: HTMLElement, animation: AnimationDefinition): Promise<void> => {
        if (!config.enableAnimations || config.enableReducedMotion) {
            return;
        }

        // Check animation limit
        if (activeAnimations.size >= config.maxConcurrentAnimations) {
            animationQueueRef.current.push(() => playAnimation(element, animation));
            return;
        }

        setIsAnimating(true);
        
        const animationKey = `${element.id || 'element'}_${Date.now()}_${Math.random()}`;
        
        try {
            // Apply animation styles
            const animationString = `${animation.name} ${animation.duration}ms ${animation.easing} ${animation.delay}ms ${animation.iterations === 'infinite' ? 'infinite' : animation.iterations} ${animation.direction} ${animation.fillMode}`;
            
            element.style.animation = animationString;
            
            // Create Web Animation API animation for better control
            const webAnimation = element.animate(animation.keyframes, {
                duration: animation.duration,
                easing: animation.easing,
                delay: animation.delay,
                iterations: animation.iterations === 'infinite' ? Infinity : animation.iterations,
                direction: animation.direction,
                fill: animation.fillMode
            });

            // Add to active animations
            setActiveAnimations(prev => new Map(prev).set(animationKey, webAnimation));

            // Start performance monitoring
            if (!performanceMonitorRef.current) {
                performanceMonitorRef.current = new PerformanceMonitor();
                performanceMonitorRef.current.start();
            }

            // Wait for animation to complete
            await webAnimation.finished;

            // Remove from active animations
            setActiveAnimations(prev => {
                const newMap = new Map(prev);
                newMap.delete(animationKey);
                return newMap;
            });

            // Process animation queue
            if (animationQueueRef.current.length > 0) {
                const nextAnimation = animationQueueRef.current.shift();
                if (nextAnimation) nextAnimation();
            }

        } catch (error) {
            console.error('Animation failed:', error);
        } finally {
            if (activeAnimations.size === 0) {
                setIsAnimating(false);
                
                // Update performance metrics
                if (performanceMonitorRef.current) {
                    setPerformance(performanceMonitorRef.current.getMetrics());
                    performanceMonitorRef.current = undefined;
                }
            }
        }
    }, [config, activeAnimations.size]);

    // Stop animation
    const stopAnimation = useCallback((element: HTMLElement): void => {
        const webAnimation = Array.from(activeAnimations.values()).find(
            anim => anim.effect.target === element
        );
        
        if (webAnimation) {
            webAnimation.cancel();
            element.style.animation = '';
            
            // Remove from active animations
            setActiveAnimations(prev => {
                const newMap = new Map(prev);
                for (const [key, anim] of newMap) {
                    if (anim.effect.target === element) {
                        newMap.delete(key);
                        break;
                    }
                }
                return newMap;
            });
        }
    }, [activeAnimations]);

    // Pause animation
    const pauseAnimation = useCallback((element: HTMLElement): void => {
        const webAnimation = Array.from(activeAnimations.values()).find(
            anim => anim.effect.target === element
        );
        
        if (webAnimation) {
            webAnimation.pause();
        }
    }, [activeAnimations]);

    // Resume animation
    const resumeAnimation = useCallback((element: HTMLElement): void => {
        const webAnimation = Array.from(activeAnimations.values()).find(
            anim => anim.effect.target === element
        );
        
        if (webAnimation) {
            webAnimation.play();
        }
    }, [activeAnimations]);

    // Register micro interaction
    const registerMicroInteraction = useCallback((interaction: MicroInteraction): void => {
        setMicroInteractions(prev => [...prev, interaction]);
        
        // Set up event listeners for the interaction
        if (config.enableMicroInteractions) {
            setupMicroInteraction(interaction);
        }
    }, [config.enableMicroInteractions]);

    // Setup micro interaction event listeners
    const setupMicroInteraction = useCallback((interaction: MicroInteraction): void => {
        const elements = document.querySelectorAll(interaction.target);
        
        elements.forEach(element => {
            const handler = (event: Event) => {
                if (!interaction.enabled) return;
                if (interaction.condition && !interaction.condition(event)) return;
                
                const target = event.target as HTMLElement;
                playAnimation(target, interaction.animation);
            };

            // Apply debouncing/throttling if specified
            let wrappedHandler = handler;
            if (interaction.debounce) {
                wrappedHandler = debounce(handler, interaction.debounce);
            } else if (interaction.throttle) {
                wrappedHandler = throttle(handler, interaction.throttle);
            }

            element.addEventListener(interaction.trigger.event, wrappedHandler);
        });
    }, [playAnimation]);

    // Utility functions for debouncing and throttling
    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(null, args), wait);
        };
    };

    const throttle = (func: Function, limit: number) => {
        let inThrottle: boolean;
        return (...args: any[]) => {
            if (!inThrottle) {
                func.apply(null, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Unregister micro interaction
    const unregisterMicroInteraction = useCallback((id: string): void => {
        setMicroInteractions(prev => prev.filter(interaction => interaction.id !== id));
    }, []);

    // Enable/disable micro interaction
    const enableMicroInteraction = useCallback((id: string, enabled: boolean): void => {
        setMicroInteractions(prev => prev.map(interaction => 
            interaction.id === id ? { ...interaction, enabled } : interaction
        ));
    }, []);

    // Apply preset
    const applyPreset = useCallback(async (element: HTMLElement, presetName: string): Promise<void> => {
        const preset = presets.find(p => p.name === presetName);
        if (!preset) {
            console.warn(`Preset "${presetName}" not found`);
            return;
        }

        for (const animation of preset.animations) {
            await playAnimation(element, animation);
        }
    }, [presets, playAnimation]);

    // Create custom animation
    const createCustomAnimation = useCallback((definition: AnimationDefinition): string => {
        const animationId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store the custom animation for later use
        // In a real implementation, you might want to store this in state or a registry
        
        return animationId;
    }, []);

    // Optimize performance
    const optimizePerformance = useCallback((): void => {
        // Reduce concurrent animations based on performance
        if (performance && performance.fps < 30) {
            setConfig(prev => ({
                ...prev,
                maxConcurrentAnimations: Math.max(1, prev.maxConcurrentAnimations - 2)
            }));
        }

        // Disable hardware acceleration if memory usage is high
        if (performance && performance.memoryUsage > 80) {
            setConfig(prev => ({
                ...prev,
                enableHardwareAcceleration: false
            }));
        }
    }, [performance]);

    // Toggle animations
    const toggleAnimations = useCallback((): void => {
        setConfig(prev => ({ ...prev, enableAnimations: !prev.enableAnimations }));
    }, []);

    // Set performance mode
    const setPerformanceMode = useCallback((mode: 'quality' | 'performance' | 'balanced'): void => {
        const modeConfigs = {
            quality: {
                enableAnimations: true,
                enableMicroInteractions: true,
                animationDuration: 400,
                enableHardwareAcceleration: true,
                maxConcurrentAnimations: 15
            },
            performance: {
                enableAnimations: true,
                enableMicroInteractions: false,
                animationDuration: 200,
                enableHardwareAcceleration: false,
                maxConcurrentAnimations: 5
            },
            balanced: {
                enableAnimations: true,
                enableMicroInteractions: true,
                animationDuration: 300,
                enableHardwareAcceleration: true,
                maxConcurrentAnimations: 10
            }
        };

        setConfig(prev => ({ ...prev, ...modeConfigs[mode], performanceMode: mode }));
    }, []);

    // Get performance metrics
    const getPerformanceMetrics = useCallback((): AnimationPerformance | null => {
        return performance;
    }, [performance]);

    // Initialize default micro interactions
    useEffect(() => {
        const defaultInteractions: MicroInteraction[] = [
            {
                id: 'button-hover',
                type: 'hover',
                target: 'button',
                animation: {
                    name: 'buttonHover',
                    duration: 200,
                    easing: 'ease-out',
                    delay: 0,
                    iterations: 1,
                    direction: 'normal',
                    fillMode: 'forwards',
                    keyframes: [
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.05)' }
                    ]
                },
                trigger: { event: 'mouseenter' },
                enabled: true,
                priority: 1
            },
            {
                id: 'input-focus',
                type: 'focus',
                target: 'input, textarea',
                animation: {
                    name: 'inputFocus',
                    duration: 150,
                    easing: 'ease-out',
                    delay: 0,
                    iterations: 1,
                    direction: 'normal',
                    fillMode: 'forwards',
                    keyframes: [
                        { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' },
                        { boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' }
                    ]
                },
                trigger: { event: 'focus' },
                enabled: true,
                priority: 2
            },
            {
                id: 'card-hover',
                type: 'hover',
                target: '.card',
                animation: {
                    name: 'cardHover',
                    duration: 250,
                    easing: 'ease-out',
                    delay: 0,
                    iterations: 1,
                    direction: 'normal',
                    fillMode: 'forwards',
                    keyframes: [
                        { transform: 'translateY(0px)', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' },
                        { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
                    ]
                },
                trigger: { event: 'mouseenter' },
                enabled: true,
                priority: 3
            }
        ];

        defaultInteractions.forEach(interaction => {
            registerMicroInteraction(interaction);
        });
    }, [registerMicroInteraction]);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setConfig(prev => ({ ...prev, enableReducedMotion: mediaQuery.matches }));

        const handleChange = (e: MediaQueryListEvent) => {
            setConfig(prev => ({ ...prev, enableReducedMotion: e.matches }));
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const value: AdvancedAnimationManagerContextType = {
        config,
        isAnimating,
        performance,
        activeAnimations,
        presets,
        microInteractions,
        playAnimation,
        stopAnimation,
        pauseAnimation,
        resumeAnimation,
        registerMicroInteraction,
        unregisterMicroInteraction,
        enableMicroInteraction,
        applyPreset,
        createCustomAnimation,
        optimizePerformance,
        toggleAnimations,
        setPerformanceMode,
        getPerformanceMetrics
    };

    return (
        <AdvancedAnimationManagerContext.Provider value={value}>
            {children}
        </AdvancedAnimationManagerContext.Provider>
    );
};

// Hook to use advanced animation manager
export const useAdvancedAnimationManager = () => {
    const context = useContext(AdvancedAnimationManagerContext);
    if (!context) {
        throw new Error('useAdvancedAnimationManager must be used within AdvancedAnimationManagerProvider');
    }
    return context;
};

// Animation Dashboard Component
interface AnimationDashboardProps {
    className?: string;
}

export const AnimationDashboard: React.FC<AnimationDashboardProps> = ({ 
    className = '' 
}) => {
    const { 
        config, 
        isAnimating, 
        performance, 
        activeAnimations, 
        presets, 
        microInteractions,
        toggleAnimations,
        setPerformanceMode,
        optimizePerformance,
        getPerformanceMetrics
    } = useAdvancedAnimationManager();

    return (
        <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-900\">Animation Manager</h2>
                <div className=\"flex items-center space-x-2\">
                    {isAnimating && (
                        <div className=\"flex items-center space-x-1 text-blue-500\">
                            <FiActivity className=\"animate-pulse\" />
                            <span className=\"text-sm\">Animating</span>
                        </div>
                    )}
                    <div className={`flex items-center space-x-1 ${config.enableAnimations ? 'text-green-500' : 'text-gray-500'}`}>
                        {config.enableAnimations ? <FiEye /> : <FiEyeOff />}
                        <span className=\"text-sm\">{config.enableAnimations ? 'Enabled' : 'Disabled'}</span>
                    </div>
                </div>
            </div>

            {/* Configuration */}
            <div className=\"mb-6 p-4 bg-gray-50 rounded-lg\">
                <h3 className=\"text-lg font-semibold mb-3\">Configuration</h3>
                <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
                    <div>
                        <label className=\"block text-sm font-medium text-gray-700 mb-1\">Animations</label>
                        <button
                            onClick={toggleAnimations}
                            className={`px-3 py-1 rounded text-sm ${
                                config.enableAnimations 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {config.enableAnimations ? 'On' : 'Off'}
                        </button>
                    </div>
                    <div>
                        <label className=\"block text-sm font-medium text-gray-700 mb-1\">Performance Mode</label>
                        <select
                            value={config.performanceMode}
                            onChange={(e) => setPerformanceMode(e.target.value as any)}
                            className=\"px-3 py-1 border border-gray-300 rounded text-sm\"
                        >
                            <option value=\"quality\">Quality</option>
                            <option value=\"balanced\">Balanced</option>
                            <option value=\"performance\">Performance</option>
                        </select>
                    </div>
                    <div>
                        <label className=\"block text-sm font-medium text-gray-700 mb-1\">Duration</label>
                        <div className=\"text-sm text-gray-600\">{config.animationDuration}ms</div>
                    </div>
                    <div>
                        <label className=\"block text-sm font-medium text-gray-700 mb-1\">Max Concurrent</label>
                        <div className=\"text-sm text-gray-600\">{config.maxConcurrentAnimations}</div>
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            {performance && (
                <div className=\"mb-6\">
                    <h3 className=\"text-lg font-semibold mb-3\">Performance Metrics</h3>
                    <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
                        <div className=\"p-3 bg-blue-50 rounded\">
                            <div className=\"flex items-center space-x-2 mb-1\">
                                <FiTrendingUp className=\"text-blue-600\" />
                                <span className=\"text-sm font-medium\">FPS</span>
                            </div>
                            <div className=\"text-xl font-bold text-blue-600\">{performance.fps}</div>
                        </div>
                        <div className=\"p-3 bg-green-50 rounded\">
                            <div className=\"flex items-center space-x-2 mb-1\">
                                <FiClock className=\"text-green-600\" />
                                <span className=\"text-sm font-medium\">Frame Time</span>
                            </div>
                            <div className=\"text-xl font-bold text-green-600\">{performance.frameTime}ms</div>
                        </div>
                        <div className=\"p-3 bg-orange-50 rounded\">
                            <div className=\"flex items-center space-x-2 mb-1\">
                                <FiActivity className=\"text-orange-600\" />
                                <span className=\"text-sm font-medium\">Active</span>
                            </div>
                            <div className=\"text-xl font-bold text-orange-600\">{performance.activeAnimations}</div>
                        </div>
                        <div className=\"p-3 bg-purple-50 rounded\">
                            <div className=\"flex items-center space-x-2 mb-1\">
                                <FiCpu className=\"text-purple-600\" />
                                <span className=\"text-sm font-medium\">CPU</span>
                            </div>
                            <div className=\"text-xl font-bold text-purple-600\">{performance.cpuUsage.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Animation Presets */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">Animation Presets</h3>
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3\">
                    {presets.map(preset => (
                        <div key={preset.name} className=\"p-3 border border-gray-200 rounded\">
                            <div className=\"font-medium\">{preset.name}</div>
                            <div className=\"text-sm text-gray-600 mb-1\">{preset.description}</div>
                            <div className=\"text-xs text-gray-500\">{preset.category}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Micro Interactions */}
            <div className=\"mb-6\">
                <h3 className=\"text-lg font-semibold mb-3\">Micro Interactions</h3>
                <div className=\"space-y-2\">
                    {microInteractions.slice(0, 5).map(interaction => (
                        <div key={interaction.id} className=\"flex items-center justify-between p-2 bg-gray-50 rounded\">
                            <div>
                                <div className=\"font-medium text-sm\">{interaction.id}</div>
                                <div className=\"text-xs text-gray-600\">{interaction.type} on {interaction.target}</div>
                            </div>
                            <div className={`px-2 py-1 text-xs rounded ${
                                interaction.enabled 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}>
                                {interaction.enabled ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Control Buttons */}
            <div className=\"flex flex-wrap gap-2\">
                <button
                    onClick={optimizePerformance}
                    className=\"px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors\"
                >
                    <FiRefreshCw className=\"inline mr-2\" />
                    Optimize Performance
                </button>
            </div>
        </div>
    );
};

export default AdvancedAnimationManagerProvider;
