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
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from "@/shared/components/base/BaseClassComponent";
import { ReactNode } from "react";

/**
 * Props for the ChatPanel component.
 */
export interface IChatPanelProps extends IBaseComponentProps {
    // No additional props needed - uses URL params
}

/**
 * State for the ChatPanel component.
 */
interface IChatPanelState extends IBaseComponentState {
    showAnalytics: boolean;
    chatId: string;
    user: any;
    validatedChatId: string;
    chat: any;
    isLoading: boolean;
    isError: boolean;
    error: any;
    messages: any;
    participants: any;
    onlineUsers: any[];
    typingUsers: any[];
    recipient: any;
    recipientId: string;
    recipientName: string;
    performanceSummary: any;
}

/**
 * ChatPanel component that handles displaying and sending messages in a chat.
 * 
 * Now uses modern useUnifiedChat with real-time features, presence management, and performance monitoring.
 * 
 * Converted to class-based component following enterprise patterns.
 */
class ChatPanel extends BaseClassComponent<IChatPanelProps, IChatPanelState> {

    private userQueries: any;

    protected override getInitialState(): Partial<IChatPanelState> {
        return {
            showAnalytics: false,
            chatId: '',
            user: null,
            validatedChatId: '',
            chat: null,
            isLoading: true,
            isError: false,
            error: null,
            messages: null,
            participants: null,
            onlineUsers: [],
            typingUsers: [],
            recipient: null,
            recipientId: '',
            recipientName: '',
            performanceSummary: null
        };
    }

    protected override onMount(): void {
        super.onMount();
        this.initializeChat();
    }

    protected override onUpdate(): void {
        this.updateChatState();
    }

    /**
     * Initialize chat data
     */
    private initializeChat = (): void => {
        try {
            const { chatId } = useParams();
            const { chatId: validatedChatId } = validateIsNotUndefined({ chatId });

            this.userQueries = useUserQueries();
            const user = this.userQueries.getSignedUserElseThrow();

            // Use modern useUnifiedChat with all features enabled
            const chat = useUnifiedChat(user.id, validatedChatId, {
                enableRealTime: true,
                enableOptimisticUpdates: true,
                cacheStrategy: 'moderate'
            });

            this.safeSetState({
                chatId: chatId || '',
                validatedChatId,
                user,
                chat
            });

            this.updateChatState();
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = `Error loading chat: ${(error as Error).message}`;
            this.safeSetState({
                isError: true,
                error: errorMessage
            });
        }
    };

    /**
     * Update chat state from hook
     */
    private updateChatState = (): void => {
        if (!this.state.chat) return;

        const {
            messages,
            participants,
            isLoading,
            isError,
            error,
            getMetrics,
            getPerformanceSummary,
            getUserPresence,
            getTypingUsers,
            getOnlineUsers
        } = this.state.chat;

        const { validatedChatId, user } = this.state;

        // Get participant information
        const participantIds = participants?.map((p: any) => p.id) || [];
        const onlineUsers = getOnlineUsers?.(validatedChatId, participantIds) || [];
        const typingUsers = getTypingUsers?.(validatedChatId) || [];

        // Get recipient information (first other participant)
        const recipient = participants?.find((p: any) => p.id !== user.id);
        const recipientId = recipient?.id || '';
        const recipientName = recipient?.username || 'Unknown';

        // Get performance summary
        const performanceSummary = getPerformanceSummary?.();

        this.safeSetState({
            messages,
            participants,
            isLoading,
            isError,
            error,
            onlineUsers,
            typingUsers,
            recipient,
            recipientId,
            recipientName,
            performanceSummary
        });
    };

    /**
     * Handle errors with modern error recovery
     */
    private handleRetry = async (): Promise<void> => {
        await this.state.chat?.retryFailedQueries?.();
    };

    /**
     * Handle message sending with analytics
     */
    private handleSendMessage = async (messageText: string): Promise<void> => {
        try {
            const { validatedChatId, chat, recipientId } = this.state;

            await chat.sendMessage({
                chatId: validatedChatId,
                messageData: {
                    content: messageText,
                    type: 'text',
                    timestamp: Date.now()
                }
            });

            // Track analytics event
            chat.recordAnalyticsEvent?.({
                type: 'message_sent',
                userId: this.state.user.id,
                chatId: validatedChatId,
                timestamp: Date.now(),
                metadata: {
                    messageLength: messageText.length,
                    recipientId
                }
            });
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    /**
     * Handle chat deletion with analytics
     */
    private handleDeleteChat = async (): Promise<void> => {
        try {
            const { validatedChatId, chat } = this.state;
            await chat.deleteChat(validatedChatId);
            chat.recordAnalyticsEvent?.({
                type: 'chat_deleted',
                userId: this.state.user.id,
                chatId: validatedChatId,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('Failed to delete chat:', error);
        }
    };

    /**
     * Toggle analytics visibility
     */
    private toggleAnalytics = (): void => {
        this.safeSetState(prev => ({ showAnalytics: !prev.showAnalytics }));
    };

    /**
     * Render error state
     */
    private renderError = (): ReactNode => {
        const { chat, error } = this.state;
        const errors = chat?.getErrorSummary?.();

        return (
            <ErrorComponent
                message={`Error loading chat: ${error?.message || 'Unknown error'}`}
                action={
                    <button
                        onClick={this.handleRetry}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                }
            >
                {errors?.map((err: any, index: number) => (
                    <div key={index} className="text-sm text-gray-600 mt-1">
                        {err.type}: {err.error}
                    </div>
                ))}
            </ErrorComponent>
        );
    };

    /**
     * Render messages or placeholder
     */
    private renderMessages = (): ReactNode => {
        const { messages, user, recipientName } = this.state;

        if (!messages?.pages?.length) {
            return <Placeholder Icon={PiChatsCircle} message="there's no messages, start a chat" type="h4" />;
        }

        // Flatten all message pages
        const allMessages = messages.pages.flatMap((page: any) => page.data || []);
        const messageCount = allMessages.length;

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
    };

    protected override renderContent(): ReactNode {
        const { isLoading, isError, showAnalytics, recipientName, onlineUsers, typingUsers, recipientId, performanceSummary, messages, participants, validatedChatId } = this.state;

        if (isError) {
            return this.renderError();
        }

        if (isLoading) return <Text className="system-message" textAlign="center">loading messages ...</Text>;

        // Flatten all message pages for analytics
        const allMessages = messages?.pages?.flatMap((page: any) => page.data || []) || [];
        const messageCount = allMessages.length;
        const participantIds = participants?.map((p: any) => p.id) || [];

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
                                onClick={this.toggleAnalytics}
                                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                {showAnalytics ? 'Hide' : 'Show'} Analytics
                            </button>
                            <button
                                onClick={this.handleDeleteChat}
                                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                                Delete Chat
                            </button>
                        </div>
                    </div>
                </div>

                {/* Analytics Panel */}
                {showAnalytics && this.state.chat?.getMetrics && (
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
                {this.renderMessages()}

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
                    onSendMessage={this.handleSendMessage}
                />
            </ChatBoard>
        );
    }
}

export default withErrorBoundary(ChatPanel);