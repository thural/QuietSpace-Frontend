import { MessageResponse } from "@/features/chat/data/models/chat";
import { ResId } from "@/shared/api/models/commonNative";
import PostMessageCard from "@/features/feed/presentation/components/post/PostMessageCard";
import InfinateScrollContainer, { InfinateScrollContainerProps } from "@/shared/ui/components/layout/InfinateScrollContainer/InfinateScrollContainer";
import { Messages } from "../../styles/MessageListStyles";
import { extractId } from "@/shared/utils/stringUtils";
import MessageBox from "./MessageBox";
import { PresenceIndicator } from "@features/chat/components/ChatPresenceComponents";
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from "@/shared/components/base/BaseClassComponent";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import useUserQueries from "@/core/network/api/queries/userQueries";

/**
 * Props for the MessagesList component, extending InfinateScrollContainerProps.
 *
 * @interface IMessageListProps
 * @extends InfinateScrollContainerProps
 * @property {Array<MessageResponse>} messages - The array of message objects to display.
 * @property {ResId} signedUserId - The ID of the signed-in user for styling purposes.
 */
export interface IMessageListProps extends IBaseComponentProps, InfinateScrollContainerProps {
    messages: Array<MessageResponse>;
    signedUserId: ResId;
}

/**
 * State for the MessagesList component.
 */
interface IMessageListState extends IBaseComponentState {
    onlineUsers: Set<string>;
    typingUsers: Set<string>;
    user: any;
    chatId: string;
    onlineInterval: NodeJS.Timeout | null;
    typingInterval: NodeJS.Timeout | null;
}

/**
 * Enhanced MessageList component with real-time updates and presence indicators.
 * 
 * This component renders a list of chat messages with real-time presence indicators,
 * typing indicators, and infinite scroll functionality. It simulates real-time updates
 * that would normally come from WebSocket connections.
 * 
 * Converted to class-based component following enterprise patterns.
 */
class MessagesList extends BaseClassComponent<IMessageListProps, IMessageListState> {

    private userQueries: any;

    protected override getInitialState(): Partial<IMessageListState> {
        return {
            onlineUsers: new Set(),
            typingUsers: new Set(),
            user: null,
            chatId: '',
            onlineInterval: null,
            typingInterval: null
        };
    }

    protected override onMount(): void {
        super.onMount();
        // Initialize user queries and get chat ID
        this.userQueries = useUserQueries();
        this.user = this.userQueries.getSignedUserElseThrow();
        const { chatId } = useParams();

        this.safeSetState({
            user: this.user,
            chatId
        });

        // Start real-time simulations
        this.startRealTimeUpdates();
    }

    protected override onUnmount(): void {
        super.onUnmount();
        // Clean up intervals
        if (this.state.onlineInterval) {
            clearInterval(this.state.onlineInterval);
        }
        if (this.state.typingInterval) {
            clearInterval(this.state.typingInterval);
        }
    }

    protected override onUpdate(): void {
        // Update user data if needed
        if (this.userQueries) {
            const user = this.userQueries.getSignedUserElseThrow();
            this.safeSetState({ user });
        }
    }

    /**
     * Start real-time update simulations
     */
    private startRealTimeUpdates = (): void => {
        const { messages, user } = this.props;

        // Simulate real-time updates (in production, this would come from WebSocket)
        const onlineInterval = setInterval(() => {
            // Simulate some users coming online/offline
            const randomUsers = messages.slice(0, 3).map(m => m.senderId).filter(id => id !== user.id);
            if (randomUsers.length > 0) {
                this.safeSetState(prev => ({
                    onlineUsers: new Set(randomUsers.slice(0, 2))
                }));
            }
        }, 5000);

        // Simulate typing indicators
        const typingInterval = setInterval(() => {
            // Simulate random typing
            const randomUsers = messages.slice(0, 2).map(m => m.senderId).filter(id => id !== user.id);
            if (randomUsers.length > 0 && Math.random() > 0.7) {
                this.safeSetState(prev => ({
                    typingUsers: new Set([randomUsers[0]])
                }));

                // Clear typing after 2 seconds
                setTimeout(() => {
                    this.safeSetState(prev => ({
                        typingUsers: new Set()
                    }));
                }, 2000);
            }
        }, 3000);

        this.safeSetState({ onlineInterval, typingInterval });
    };

    /**
     * Determines the style to apply based on the sender ID.
     *
     * @param {ResId} senderId - The ID of the message sender.
     * @param {ResId} signedUserId - The ID of the signed-in user.
     * @returns {React.CSSProperties} - The style object to apply to the message box.
     */
    private getAppliedStyle = (senderId: ResId, signedUserId: ResId): React.CSSProperties =>
        (senderId !== signedUserId) ? {
            marginRight: "auto",
            borderRadius: '1.25rem 1.25rem 1.25rem 0rem',
        } : {
            marginLeft: "auto",
            color: "white",
            borderColor: "blue",
            backgroundColor: "#3c3cff",
            borderRadius: '1rem 1rem 0rem 1rem'
        };

    protected override renderContent(): ReactNode {
        const { messages, signedUserId, isFetchingNextPage, hasNextPage, fetchNextPage } = this.props;
        const { onlineUsers, typingUsers } = this.state;

        return (
            <Messages>
                {/* Real-time status bar */}
                {(onlineUsers.size > 0 || typingUsers.size > 0) && (
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                                {onlineUsers.size > 0 && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600">Online:</span>
                                        <div className="flex -space-x-1">
                                            {Array.from(onlineUsers).slice(0, 3).map(userId => (
                                                <PresenceIndicator
                                                    key={userId}
                                                    userId={userId}
                                                    showStatus={false}
                                                    showTyping={false}
                                                    className="w-2 h-2"
                                                />
                                            ))}
                                            {onlineUsers.size > 3 && (
                                                <span className="text-gray-500 text-xs">+{onlineUsers.size - 3}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {typingUsers.size > 0 && (
                                    <div className="flex items-center space-x-2 text-blue-600">
                                        <div className="flex space-x-1">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span>Someone is typing...</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                Real-time updates active
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <InfinateScrollContainer
                    isFetchingNextPage={isFetchingNextPage}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                >
                    {messages.map((message, key) => {
                        const appliedStyle = this.getAppliedStyle(message.senderId, signedUserId);
                        const isOnline = onlineUsers.has(message.senderId);
                        const isTyping = typingUsers.has(message.senderId);

                        return (
                            <div key={key} className="relative">
                                {message.text.startsWith("##MP##") ? (
                                    <PostMessageCard style={appliedStyle} postId={extractId(message.text)} />
                                ) : (
                                    <MessageBox style={appliedStyle} message={message} />
                                )}

                                {/* Presence indicator for message sender */}
                                {message.senderId !== signedUserId && (
                                    <div className="absolute top-2 right-2">
                                        <PresenceIndicator
                                            userId={message.senderId}
                                            showStatus={true}
                                            showTyping={isTyping}
                                            className="w-2 h-2"
                                        />
                                    </div>
                                )}

                                {/* Online status indicator */}
                                {message.senderId !== signedUserId && isOnline && (
                                    <div className="absolute bottom-2 right-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </InfinateScrollContainer>
            </Messages>
        );
    }
}

export default MessagesList;