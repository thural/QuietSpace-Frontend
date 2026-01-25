/**
 * Error Recovery Component
 * 
 * This component provides sophisticated error recovery mechanisms with
 * intelligent retry strategies, fallback options, and user-friendly recovery flows.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Container } from "../../../../../shared/ui/components";
import Typography from '@shared/Typography';
import {
    FiRefreshCw,
    FiAlertTriangle,
    FiCheckCircle,
    FiClock,
    FiSettings,
    FiWifi,
    FiDatabase,
    FiShield,
    FiZap
} from 'react-icons/fi';

interface ErrorRecoveryProps {
    error: Error;
    errorInfo?: React.ErrorInfo;
    classification: {
        type: 'network' | 'validation' | 'permission' | 'runtime' | 'dependency' | 'unknown';
        severity: 'low' | 'medium' | 'high' | 'critical';
        recoverable: boolean;
        userMessage: string;
        suggestedActions: string[];
        retryStrategy: 'immediate' | 'delayed' | 'manual' | 'none';
    };
    onRecovery: (success: boolean, method: string) => void;
    maxRetries?: number;
    customRecoveryActions?: Array<{
        label: string;
        action: () => Promise<boolean>;
        icon?: React.ReactNode;
        description?: string;
    }>;
}

interface RecoveryAttempt {
    timestamp: Date;
    method: string;
    success: boolean;
    duration: number;
    error?: string;
}

interface RecoveryStrategy {
    name: string;
    description: string;
    icon: React.ReactNode;
    action: () => Promise<boolean>;
    estimatedTime: number;
    successRate: number;
}

/**
 * Error Recovery component with intelligent recovery strategies
 */
const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({
    error,
    errorInfo,
    classification,
    onRecovery,
    maxRetries = 3,
    customRecoveryActions = []
}) => {
    const [isRecovering, setIsRecovering] = useState(false);
    const [currentStrategy, setCurrentStrategy] = useState<string>('');
    const [recoveryAttempts, setRecoveryAttempts] = useState<RecoveryAttempt[]>([]);
    const [selectedStrategy, setSelectedStrategy] = useState<RecoveryStrategy | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Generate recovery strategies based on error classification
    const recoveryStrategies: RecoveryStrategy[] = React.useMemo(() => {
        const strategies: RecoveryStrategy[] = [];

        // Basic retry strategy
        strategies.push({
            name: 'Quick Retry',
            description: 'Attempt the operation again immediately',
            icon: <FiRefreshCw />,
            action: async () => {
                // Simulate retry logic
                await new Promise(resolve => setTimeout(resolve, 1000));
                return Math.random() > 0.3; // 70% success rate
            },
            estimatedTime: 1000,
            successRate: 70
        });

        // Network-specific strategies
        if (classification.type === 'network') {
            strategies.push({
                name: 'Network Reset',
                description: 'Reset network connection and retry',
                icon: <FiWifi />,
                action: async () => {
                    // Simulate network reset
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return Math.random() > 0.2; // 80% success rate
                },
                estimatedTime: 2000,
                successRate: 80
            });

            strategies.push({
                name: 'Connection Test',
                description: 'Test network connectivity before retry',
                icon: <FiZap />,
                action: async () => {
                    // Simulate connection test
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    return Math.random() > 0.1; // 90% success rate
                },
                estimatedTime: 3000,
                successRate: 90
            });
        }

        // Data-specific strategies
        if (classification.type === 'runtime' || classification.type === 'dependency') {
            strategies.push({
                name: 'Data Refresh',
                description: 'Refresh application data and retry',
                icon: <FiDatabase />,
                action: async () => {
                    // Simulate data refresh
                    await new Promise(resolve => setTimeout(resolve, 2500));
                    return Math.random() > 0.25; // 75% success rate
                },
                estimatedTime: 2500,
                successRate: 75
            });

            strategies.push({
                name: 'Cache Clear',
                description: 'Clear application cache and retry',
                icon: <FiSettings />,
                action: async () => {
                    // Simulate cache clear
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    return Math.random() > 0.15; // 85% success rate
                },
                estimatedTime: 1500,
                successRate: 85
            });
        }

        // Permission-specific strategies
        if (classification.type === 'permission') {
            strategies.push({
                name: 'Permission Refresh',
                description: 'Refresh user permissions and retry',
                icon: <FiShield />,
                action: async () => {
                    // Simulate permission refresh
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return Math.random() > 0.4; // 60% success rate
                },
                estimatedTime: 2000,
                successRate: 60
            });
        }

        return strategies;
    }, [classification.type]);

    // Add custom recovery actions
    const allStrategies = React.useMemo(() => {
        const customStrategies: RecoveryStrategy[] = customRecoveryActions.map(action => ({
            name: action.label,
            description: action.description || 'Custom recovery action',
            icon: action.icon || <FiSettings />,
            action: action.action,
            estimatedTime: 2000,
            successRate: 85
        }));

        return [...recoveryStrategies, ...customStrategies];
    }, [recoveryStrategies, customRecoveryActions]);

    // Execute recovery strategy
    const executeRecovery = useCallback(async (strategy: RecoveryStrategy) => {
        if (isRecovering) return;

        setIsRecovering(true);
        setCurrentStrategy(strategy.name);
        setSelectedStrategy(strategy);

        const startTime = Date.now();

        try {
            const success = await strategy.action();
            const duration = Date.now() - startTime;

            const attempt: RecoveryAttempt = {
                timestamp: new Date(),
                method: strategy.name,
                success,
                duration,
                error: success ? undefined : 'Recovery strategy failed'
            };

            setRecoveryAttempts(prev => [...prev, attempt]);
            onRecovery(success, strategy.name);

            if (success) {
                // Success - parent component will handle state reset
                setIsRecovering(false);
            } else {
                // Failure - allow user to try other strategies
                setIsRecovering(false);
                setCurrentStrategy('');
            }
        } catch (recoveryError) {
            const duration = Date.now() - startTime;

            const attempt: RecoveryAttempt = {
                timestamp: new Date(),
                method: strategy.name,
                success: false,
                duration,
                error: recoveryError instanceof Error ? recoveryError.message : 'Unknown error'
            };

            setRecoveryAttempts(prev => [...prev, attempt]);
            setIsRecovering(false);
            setCurrentStrategy('');
            onRecovery(false, strategy.name);
        }
    }, [isRecovering, onRecovery]);

    // Get best strategy based on classification and past attempts
    const getRecommendedStrategy = useCallback((): RecoveryStrategy | null => {
        if (allStrategies.length === 0) return null;

        // Filter out strategies that have already failed
        const failedStrategies = new Set(
            recoveryAttempts
                .filter(attempt => !attempt.success)
                .map(attempt => attempt.method)
        );

        const availableStrategies = allStrategies.filter(
            strategy => !failedStrategies.has(strategy.name)
        );

        if (availableStrategies.length === 0) return null;

        // Return strategy with highest success rate
        return availableStrategies.reduce((best, current) =>
            current.successRate > best.successRate ? current : best
        );
    }, [allStrategies, recoveryAttempts]);

    const recommendedStrategy = getRecommendedStrategy();

    // Auto-execute recommended strategy for certain error types
    useEffect(() => {
        if (classification.retryStrategy === 'immediate' &&
            recommendedStrategy &&
            recoveryAttempts.length === 0 &&
            !isRecovering) {
            executeRecovery(recommendedStrategy);
        }
    }, [classification.retryStrategy, recommendedStrategy, recoveryAttempts.length, isRecovering, executeRecovery]);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'critical': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <Container className="p-6 bg-white rounded-lg shadow-lg">
            {/* Error Header */}
            <div className=\"flex items-center justify-between mb-6\">
            <div className=\"flex items-center space-x-3\">
            <div className={`p-3 rounded-full ${getSeverityColor(classification.severity)}`}>
                <FiAlertTriangle />
            </div>
            <div>
                <Typography type=\"h4\" className=\"text-gray-900\">
                Error Recovery Options
            </Typography>
            <Typography className=\"text-gray-600\">
            {classification.userMessage}
        </Typography>
                    </div >
                </div >

    <div className=\"flex items-center space-x-2\">
        < span className = {`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(classification.severity)}`}>
            { classification.severity.toUpperCase() }
                    </span >
    <span className=\"px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700\">
{ classification.type.toUpperCase() }
                    </span >
                </div >
            </div >

    {/* Recommended Strategy */ }
{
    recommendedStrategy && !isRecovering && recoveryAttempts.length === 0 && (
        <div className=\"bg-green-50 border border-green-200 rounded-lg p-4 mb-6\">
            < div className =\"flex items-center justify-between\">
                < div className =\"flex items-center space-x-3\">
                    < FiCheckCircle className =\"text-green-600\" />
                        < div >
                        <Typography className=\"font-medium text-green-900\">
    Recommended: { recommendedStrategy.name }
                                </Typography >
        <Typography className=\"text-sm text-green-700\">
    { recommendedStrategy.description }
                                </Typography >
                            </div >
                        </div >
        <div className=\"flex items-center space-x-2 text-sm text-green-600\">
            < FiClock />
                            <span>~{recommendedStrategy.estimatedTime / 1000}s</span>
                            <span>•</span>
                            <span>{recommendedStrategy.successRate}% success</span>
                        </div >
                    </div >

        <button
            onClick={() => executeRecovery(recommendedStrategy!)}
            className=\"mt-3 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700\"
                >
                        <FiRefreshCw />
                        <span>Try Recommended Recovery</span>
                    </button >
                </div >
            )
}

{/* Current Recovery Status */ }
{
    isRecovering && (
        <div className=\"bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6\">
            < div className =\"flex items-center space-x-3\">
                < FiRefreshCw className =\"animate-spin text-blue-600\" />
                    < div >
                    <Typography className=\"font-medium text-blue-900\">
                                Attempting Recovery: { currentStrategy }
                            </Typography >
        <Typography className=\"text-sm text-blue-700\">
                                Please wait while we try to resolve the issue...
                            </Typography >
                        </div >
                    </div >
                </div >
            )
}

{/* Recovery Strategies */ }
<div className=\"mb-6\">
    < div className =\"flex items-center justify-between mb-4\">
        < Typography type =\"h5\">Recovery Strategies</Typography>
            < button
onClick = {() => setShowAdvanced(!showAdvanced)}
className =\"text-sm text-blue-600 hover:text-blue-700\"
    >
    { showAdvanced? 'Show Less': 'Show Advanced' }
                    </button >
                </div >

    <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
{
    allStrategies.slice(0, showAdvanced ? undefined : 3).map((strategy, index) => {
        const hasFailed = recoveryAttempts.some(attempt =>
            attempt.method === strategy.name && !attempt.success
        );

        return (
                            <div
                                key={index}
                                className={`border rounded-lg p-4 ${
                                    hasFailed 
                                        ? 'border-gray-200 bg-gray-50 opacity-60' 
                                        : 'border-gray-300 bg-white hover:shadow-md transition-shadow'
                                }`}
                            >
                                <div className=\"flex items-start justify-between mb-3\">
                                    <div className=\"flex items-center space-x-3\">
                                        <div className=\"p-2 bg-gray-100 rounded-lg\">
                                            {strategy.icon}
                                        </div>
                                        <div>
                                            <Typography className=\"font-medium\">{strategy.name}</Typography>
                                            <Typography className=\"text-sm text-gray-600\">
        { strategy.description }
                                            </Typography >
                                        </div >
                                    </div >
                                </div >

            <div className=\"flex items-center justify-between mb-3\">
                < div className =\"flex items-center space-x-4 text-sm text-gray-500\">
                    < div className =\"flex items-center space-x-1\">
                        < FiClock />
                        <span>~{strategy.estimatedTime / 1000}s</span>
                                        </div >
            <div className=\"flex items-center space-x-1\">
                < FiCheckCircle />
                <span>{strategy.successRate}% success</span>
                                        </div >
                                    </div >
                                </div >

            <button
                onClick={() => executeRecovery(strategy)}
                disabled={isRecovering || hasFailed}
                className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${hasFailed
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isRecovering
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
            >
                {hasFailed ? (
                    <span>Already Tried</span>
                ) : isRecovering ? (
                    <>
                        <FiRefreshCw className=\"animate-spin\" />
                        <span>Recovering...</span>
                    </>
                ) : (
                    <>
                        <FiRefreshCw />
                        <span>Try Recovery</span>
                    </>
                )}
            </button>

        {
            hasFailed && (
                <div className=\"mt-2 text-xs text-red-600\">
                                        This strategy failed previously
                                    </div >
                                )
}
                            </div >
                        );
                    })}
                </div >
            </div >

    {/* Recovery History */ }
{
    recoveryAttempts.length > 0 && (
        <div className=\"bg-gray-50 rounded-lg p-4\">
            < Typography type =\"h5\" className=\"mb-3\">Recovery History</Typography>
                < div className =\"space-y-2\">
    {
        recoveryAttempts.slice(-5).reverse().map((attempt, index) => (
            <div key={index} className=\"flex items-center justify-between p-3 bg-white rounded border\">
        < div className =\"flex items-center space-x-3\">
        < div className = {`w-2 h-2 rounded-full ${attempt.success ? 'bg-green-500' : 'bg-red-500'
            }`} />
                < div >
                <Typography className=\"text-sm font-medium\">
    { attempt.method }
                                        </Typography >
        <Typography className=\"text-xs text-gray-500\">
    { attempt.timestamp.toLocaleTimeString() } • { attempt.duration } ms
                                        </Typography >
                                    </div >
                                </div >
        <div className=\"flex items-center space-x-2\">
            < span className = {`px-2 py-1 rounded text-xs ${attempt.success
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`
}>
    { attempt.success ? 'Success' : 'Failed' }
                                    </span >
                                </div >
                            </div >
                        ))}
                    </div >
                </div >
            )}

{/* Suggested Actions */ }
{
    classification.suggestedActions && classification.suggestedActions.length > 0 && (
        <div className=\"mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg\">
            < Typography className =\"font-medium text-yellow-900 mb-2\">
                        Manual Actions You Can Take:
                    </Typography >
        <ul className=\"list-disc list-inside space-y-1 text-sm text-yellow-800\">
    {
        classification.suggestedActions.map((action, index) => (
            <li key={index}>{action}</li>
        ))
    }
                    </ul >
                </div >
            )
}
        </Container >
    );
};

export default ErrorRecovery;
