import { ChatResponse } from "@/features/chat/data/models/chat";
import { Container } from "../../../../../shared/ui/components";
import Typography from "@/shared/Typography";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import styles from "../../styles/chatSidebarStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import ChatCard from "./ChatCard";
import ChatQuery from "./ChatQuery";
import { TypingIndicator, PresenceIndicator } from "@features/chat/components/ChatPresenceComponents";
import React from "react";

interface ChatSidebarProps extends GenericWrapper {
    chats: Array<ChatResponse>
    selectedChatId?: string
    onChatSelect?: (chatId: string) => void
    chat?: any // useUnifiedChat instance
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chats,
    selectedChatId,
    onChatSelect,
    chat
}) => {
    const classes = styles();

    // Get participant IDs for typing indicators
    const getParticipantIds = (chatItem: ChatResponse): string[] => {
        return chatItem.members?.map((member: any) => member.id) || [];
    };

    const ChatList = () => {
        return (chats?.length > 0) ?
            chats.map((chatItem, key) => (
                <div key={key} className="relative">
                    <ChatCard
                        chat={chatItem}
                        isSelected={selectedChatId === chatItem.id}
                        onClick={() => onChatSelect?.(chatItem.id)}
                    />

                    {/* Typing indicator for each chat */}
                    <div className="absolute bottom-2 right-2">
                        <TypingIndicator
                            chatId={chatItem.id}
                            participantIds={getParticipantIds(chatItem)}
                            className="text-xs"
                        />
                    </div>

                    {/* Online status for group chats */}
                    {chatItem.members && chatItem.members.length > 2 && (
                        <div className="absolute top-2 right-2">
                            <div className="flex -space-x-2">
                                {chatItem.members.slice(0, 3).map((member: any, index: number) => (
                                    <PresenceIndicator
                                        key={index}
                                        userId={member.id}
                                        showStatus={false}
                                        showTyping={false}
                                        className="w-2 h-2"
                                    />
                                ))}
                                {chatItem.members.length > 3 && (
                                    <div className="w-2 h-2 rounded-full bg-gray-400 text-xs flex items-center justify-center text-white">
                                        +{chatItem.members.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))
            : <Typography ta="center">there's no chat yet</Typography>
    }

    return (
        <Container className={classes.chatContainer}>
            {/* Chat Query with real-time features */}
            <ChatQuery chat={chat} />

            {/* Chat List with presence indicators */}
            <div className="mt-4">
                <ChatList />
            </div>
        </Container>
    )
}

export default withErrorBoundary(ChatSidebar);