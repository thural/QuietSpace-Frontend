import { UserResponse } from "@/features/profile/data/models/user";
import LoaderStyled from "@/shared/LoaderStyled";
import useChatQuery from "@features/chat/application/hooks/useChatQuery";
import styles from "../../styles/chatQueryStyles";
import AnchorStyled from "@shared/AnchorStyled";
import { Container } from "../../../../../shared/ui/components";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import UserCard from "@shared/UserCard";
import React from "react";
import ChatQueryInput from "./ChatQueryInput";
import { PresenceIndicator } from "@features/chat/components/ChatPresenceComponents";

interface ChatQueryProps {
    chat?: any // useUnifiedChat instance
}


const ChatQuery: React.FC<ChatQueryProps> = ({ chat }) => {
    const classes = styles();

    const {
        queryResult,
        handleChatCreation,
        appliedStyle,
        inputProps,
        makeQueryMutation,
        user,
        chats,
        createChatLoading
    } = useChatQuery();

    // Get presence for search results
    const getUserPresence = (userId: string) => {
        return chat?.getUserPresence?.(userId);
    };

    const RecentQueries = React.memo(() => (
        <FlexStyled className={classes.recentQueries}>
            <Typography type="h4">Recent</Typography>
            <AnchorStyled label="clear all" onClick={() => console.log('Clear recent queries')} />
        </FlexStyled>
    ));

    // Show loading state for chat creation
    const LoadingIndicator = () => {
        if (createChatLoading) {
            return (
                <FlexStyled className="px-4 py-2 bg-blue-50 border border-blue-200 rounded">
                    <Typography className="text-blue-700 text-sm">Creating chat...</Typography>
                </FlexStyled>
            );
        }
        return null;
    };

    const RenderResult = React.memo(() => {
        if (makeQueryMutation.isPending) return <LoaderStyled />;
        if (queryResult.length === 0) return <RecentQueries />;

        return queryResult.map((user: UserResponse, key: number) => {
            const userPresence = getUserPresence(user.id);

            return (
                <div key={key} className="relative">
                    <UserCard
                        userId={user.id}
                        isDisplayEmail={true}
                        onClick={(e: React.MouseEvent) => handleChatCreation(e, user)}
                    />

                    {/* Presence indicator for search results */}
                    <div className="absolute top-2 right-2">
                        <PresenceIndicator
                            userId={user.id}
                            showStatus={true}
                            showTyping={false}
                            className="w-2 h-2"
                        />
                    </div>

                    {/* Online status indicator */}
                    {userPresence?.status === 'online' && (
                        <div className="absolute bottom-2 right-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                        </div>
                    )}
                </div>
            );
        });
    });

    const QueryPanel = React.memo(() => (
        <FlexStyled
            className={classes.resultContainer}
            style={appliedStyle}
            ref={inputProps.resultListRef}
        >
            <RenderResult />
        </FlexStyled>
    ));

    return (
        <Container
            onFocus={inputProps.handleInputFocus}
            onBlur={inputProps.handleInputBlur}
            className={classes.searchContainer}
        >
            <ChatQueryInput {...inputProps} />
            <LoadingIndicator />
            <QueryPanel />
        </Container>
    );
};

export default ChatQuery;