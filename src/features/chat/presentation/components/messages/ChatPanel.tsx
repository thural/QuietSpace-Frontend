import ChatHeadline from "./ChatHeadline";
import MessageInput from "./MessageInput";
import MessagesList from "./MessageList";
import Placeholder from "./Placeholder";
import { ChatBoard } from "../../styles/ChatPanelStyles";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import { Text } from "../../../../shared/ui/components";
import { useUnifiedChat } from "@features/chat/application/hooks/useUnifiedChat";
import { MessageInputWithTyping, ChatPresenceBar, PresenceIndicator } from "@features/chat/components/ChatPresenceComponents";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import styles from "../../styles/chatPanelStyles";
import { validateIsNotUndefined } from "@/shared/utils/validations";
import { PiChatsCircle } from "react-icons/pi";
import { useParams } from "react-router-dom";
import useUserQueries from "@/core/network/api/queries/userQueries";
import React, { useState } from "react";

/**
 * ChatPanel component that handles displaying and sending messages in a chat.
 * Now uses modern useUnifiedChat with real-time features, presence management, and performance monitoring.
 *
 * @returns {JSX.Element} - The rendered chat panel component.
 */
const ChatPanel = () => {
    const { chatId } = useParams();
    const [showAnalytics, setShowAnalytics] = useState(false);

    try {
        const { chatId: validatedChatId } = validateIsNotUndefined({ chatId });
        const { getSignedUserElseThrow } = useUserQueries();
        const user = getSignedUserElseThrow();

        // Use modern useUnifiedChat with all features enabled
        const chat = useUnifiedChat(user.id, validatedChatId, {
            enableRealTime: true,
            enableOptimisticUpdates: true,
            cacheStrategy: 'moderate'
        });

        const {
            messages,
            participants,
            isLoading,
            isError,
            error,
            createChat,
            sendMessage,
            deleteChat,
            // Performance monitoring
            getMetrics,
            getPerformanceSummary,
            // Presence features
            getUserPresence,
            getTypingUsers,
            getOnlineUsers,
            startTyping,
            stopTyping,
            // Analytics
            recordAnalyticsEvent
        } = chat;

        // Handle errors with modern error recovery
        const handleRetry = async () => {
            await chat.retryFailedQueries?.();
        };

        // Get participant information
        const participantIds = participants?.map(p => p.id) || [];
        const onlineUsers = getOnlineUsers?.(validatedChatId, participantIds) || [];
        const typingUsers = getTypingUsers?.(validatedChatId) || [];

        // Get recipient information (first other participant)
        const recipient = participants?.find(p => p.id !== user.id);
        const recipientId = recipient?.id;
        const recipientName = recipient?.username || 'Unknown';

        // Handle message sending with analytics
        const handleSendMessage = async (messageText: string) => {
            try {
                await sendMessage({
                    chatId: validatedChatId,
                    messageData: {
                        content: messageText,
                        type: 'text',
                        timestamp: Date.now()
                    }
                });

                // Track analytics event
                recordAnalyticsEvent?.({
                    type: 'message_sent',
                    userId: user.id,
                    chatId: validatedChatId,
                    timestamp: Date.now(),
                    metadata: {
                        messageLength: messageText.length,
                        recipientId: recipientId
                    }
                });
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        };

        // Handle chat deletion with analytics
        const handleDeleteChat = async () => {
            try {
                await deleteChat(validatedChatId);
                recordAnalyticsEvent?.({
                    type: 'chat_deleted',
                    userId: user.id,
                    chatId: validatedChatId,
                    timestamp: Date.now()
                });
            } catch (error) {
                console.error('Failed to delete chat:', error);
            }
        };

        // Get performance summary
        const performanceSummary = getPerformanceSummary?.();

        if (isError || error) {
            const errors = chat.getErrorSummary?.();
            return (
                <ErrorComponent
                    message={`Error loading chat: ${error?.message || 'Unknown error'}`}
                    action={
                        <button
                            onClick={handleRetry}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    }
                >
                    {errors?.map((err, index) => (
                        <div key={index} className="text-sm text-gray-600 mt-1">
                            {err.type}: {err.error}
                        </div>
                    ))}
                </ErrorComponent>
            );
        }

        if (isLoading) return <Text className="system-message" textAlign="center">loading messages ...</Text>;
        if (!messages?.pages?.length) return <Placeholder Icon={PiChatsCircle} message="there's no messages, start a chat" type="h4" />;

        // Flatten all message pages
        const allMessages = messages.pages.flatMap(page => page.data || []);
        const messageCount = allMessages.length;

        /**
         * Renders the appropriate result based on the current chat state.
         *
         * @returns {JSX.Element} - The rendered messages list or a loading/error message.
         */
        const RenderResult = () => {
            if (messageCount === 0) {
                return (
                    <Text className="system-message" textAlign="center">
                        send your first message to <strong>{recipientName}</strong>
                    </Text>
                );
            }
            return (
                <MessagesList
                    hasNextPage={messages.hasNextPage}
                    isFetchingNextPage={messages.isFetchingNextPage}
                    signedUserId={user.id}
                    fetchNextPage={messages.fetchNextPage}
                    messages={allMessages}
                />
            );
        }

        return (
            <ChatBoard>
                {/* Chat Header with presence */}
                <div className="border-b border-gray-200 px-4 py-3 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{recipientName}</h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>{onlineUsers.length} online</span>
                                    {typingUsers.length > 0 && (
                                        <span className="text-blue-600">{typingUsers.length} typing</span>
                                    )}
                                </div>
                            </div>
                            {recipientId && (
                                <PresenceIndicator
                                    userId={recipientId}
                                    showStatus={true}
                                    showTyping={true}
                                />
                            )}
                        </div>

                        {/* Performance and Analytics */}
                        <div className="flex items-center space-x-2">
                            {performanceSummary && (
                                <div className={`text-xs px-2 py-1 rounded ${performanceSummary.overall === 'excellent' ? 'bg-green-100 text-green-700' :
                                    performanceSummary.overall === 'good' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {performanceSummary.overall}
                                </div>
                            )}
                            <button
                                onClick={() => setShowAnalytics(!showAnalytics)}
                                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                {showAnalytics ? 'Hide' : 'Show'} Analytics
                            </button>
                            <button
                                onClick={handleDeleteChat}
                                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                                Delete Chat
                            </button>
                        </div>
                    </div>
                </div>

                {/* Analytics Panel */}
                {showAnalytics && getMetrics && (
                    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Chat Analytics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div className="bg-white p-2 rounded">
                                <div className="font-medium">Messages</div>
                                <div className="text-gray-600">{messageCount}</div>
                            </div>
                            <div className="bg-white p-2 rounded">
                                <div className="font-medium">Participants</div>
                                <div className="text-gray-600">{participants?.length || 0}</div>
                            </div>
                            <div className="bg-white p-2 rounded">
                                <div className="font-medium">Online</div>
                                <div className="text-gray-600">{onlineUsers.length}</div>
                            </div>
                            <div className="bg-white p-2 rounded">
                                <div className="font-medium">Typing</div>
                                <div className="text-gray-600">{typingUsers.length}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <RenderResult />

                {/* Typing Indicator */}
                <TypingIndicator
                    chatId={validatedChatId}
                    participantIds={participantIds}
                />

                {/* Presence Bar */}
                <ChatPresenceBar
                    chatId={validatedChatId}
                    participantIds={participantIds}
                />

                {/* Message Input with Typing */}
                <MessageInputWithTyping
                    chatId={validatedChatId}
                    onSendMessage={handleSendMessage}
                />
            </ChatBoard>
        );
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `Error loading chat: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }
}

export default withErrorBoundary(ChatPanel);