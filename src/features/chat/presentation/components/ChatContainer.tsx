import useUserQueries from "@/core/network/api/queries/userQueries";
import DefaultContainer from "@/shared/DefaultContainer";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import { useUnifiedChat } from "@features/chat/application/hooks/useUnifiedChat";
import { ChatPresenceBar, PresenceIndicator } from "@features/chat/components/ChatPresenceComponents";
import { AnalyticsProvider, useAnalytics } from "@features/chat/presentation/components/analytics/AnalyticsProvider";
import AnalyticsDashboard from "@features/chat/presentation/components/analytics/AnalyticsDashboard";
import MetricsDisplay from "@features/chat/presentation/components/analytics/MetricsDisplay";
import {
    ErrorBoundaryEnhanced,
    errorClassifier,
    errorReporter,
    type ErrorContext
} from "@features/chat/presentation/components/errors";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { Container, Contacts, Messages } from "../styles/chatContainerStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import LoaderStyled from "@/shared/LoaderStyled";
import ChatSidebar from "./sidebar/ChatSidebar";
import React, { useState } from "react";
import { FiBarChart2, FiX, FiRefreshCw } from "react-icons/fi";

/**
 * ChatContainer component that wraps chat-related components and manages chat data fetching.
 * Now uses modern useUnifiedChat with real-time features and performance monitoring.
 *
 * @param {GenericWrapper} props - The props for the ChatContainer component.
 * @returns {JSX.Element} - The rendered chat container component.
 */
const ChatContainer: React.FC<GenericWrapper> = ({ children }) => {
    const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showMetrics, setShowMetrics] = useState(false);

    const { getSignedUserElseThrow } = useUserQueries();

    try {
        const user = getSignedUserElseThrow();

        // Use modern useUnifiedChat with all features enabled
        const chat = useUnifiedChat(user.id, undefined, {
            enableRealTime: true,
            enableOptimisticUpdates: true,
            cacheStrategy: 'moderate'
        });

        const { chats, isLoading, isError, error, getMetrics, getPerformanceSummary } = chat;

        // Handle errors with modern error recovery
        const handleRetry = async () => {
            await chat.retryFailedQueries?.();
        };

        // Enhanced error handling with classification and reporting
        const handleError = async (error: Error, errorInfo?: any) => {
            const classification = errorClassifier.classifyError(error, {
                component: 'ChatContainer',
                action: 'load-chats',
                userRole: 'user',
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                userId: user.id
            });

            // Report error
            await errorReporter.reportError(error, classification, {
                component: 'ChatContainer',
                action: 'load-chats',
                userRole: 'user',
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                userId: user.id
            });

            console.error('ChatContainer Error:', { error, classification });
        };

        // Get performance summary for monitoring
        const performanceSummary = getPerformanceSummary?.();

        if (isLoading) return <LoaderStyled />;
        if (error) {
            const errors = chat.getErrorSummary?.();
            return (
                <ErrorComponent
                    message={`could not fetch chat data: ${error?.message || 'Unknown error'}`}
                    action={
                        <button
                            onClick={handleRetry}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    }
                />
            );
        }

        if (!chats?.content) return <ErrorComponent message='No chat data available!' />;

        return (
            <AnalyticsProvider userId={user.id} chatId={selectedChatId} autoRefresh={true}>
                <Container>
                    {/* Analytics Toggle Buttons */}
                    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                            title="Toggle Analytics Dashboard"
                        >
                            {showAnalytics ? <FiX /> : <FiBarChart2 />}
                        </button>

                        <button
                            onClick={() => setShowMetrics(!showMetrics)}
                            className="p-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors text-xs"
                            title="Toggle Metrics Display"
                        >
                            {showMetrics ? '✕' : '📊'}
                        </button>
                    </div>

                    {/* Analytics Dashboard Overlay */}
                    {showAnalytics && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                    <h4 className="text-lg font-semibold">Chat Analytics Dashboard</h4>
                                    <button
                                        onClick={() => setShowAnalytics(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <FiX className="text-xl" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <AnalyticsDashboard userId={user.id} chatId={selectedChatId} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Metrics Display Bar */}
                    {showMetrics && (
                        <div className="fixed bottom-4 left-4 right-4 z-40">
                            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-md font-medium">Real-time Metrics</h5>
                                    <button
                                        onClick={() => setShowMetrics(false)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                                <MetricsDisplay compact={true} />
                            </div>
                        </div>
                    )}

                    {/* Performance Indicator */}
                    {performanceSummary && (
                        <div className={`px-4 py-2 border-b text-sm ${performanceSummary.overall === 'excellent' ? 'bg-green-50 text-green-700' :
                            performanceSummary.overall === 'good' ? 'bg-blue-50 text-blue-700' :
                                performanceSummary.overall === 'fair' ? 'bg-yellow-50 text-yellow-700' :
                                    'bg-red-50 text-red-700'
                            }`}>
                            <div className="flex items-center justify-between">
                                <span>Performance: {performanceSummary.overall.toUpperCase()}</span>
                                <div className="flex items-center space-x-2">
                                    <PresenceIndicator userId={user.id} showStatus={true} showTyping={false} />
                                    {getMetrics && (
                                        <button
                                            onClick={() => console.log('Metrics:', getMetrics())}
                                            className="text-xs px-2 py-1 bg-white rounded hover:bg-gray-100"
                                        >
                                            Metrics
                                        </button>
                                    )}
                                </div>
                            </div>
                            {performanceSummary.issues.length > 0 && (
                                <div className="text-xs mt-1">
                                    Issues: {performanceSummary.issues.join(', ')}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Chat Sidebar with real-time updates */}
                    <ChatSidebar
                        chats={chats.content}
                        className="chat-sidebar"
                        selectedChatId={selectedChatId}
                        onChatSelect={setSelectedChatId}
                        chat={chat}
                    />

                    {/* Main content area */}
                    <div className="flex-1">
                        {children}
                    </div>
                </Container>
            </AnalyticsProvider>
        );
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `Authentication error: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }
}

export default withErrorBoundary(ChatContainer);