import ChatHeadline from "@/components/chat/message/ChatHeadline";
import MessageInput from "@/components/chat/message/MessageInput";
import MessagesList from "@/components/chat/message/MessageList";
import Placeholder from "@/components/chat/message/Placeholder";
import BoxStyled from "@/components/shared/BoxStyled";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import Typography from "@/components/shared/Typography";
import { useChat } from "@/services/hook/chat/useChat";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/chat/chatPanelStyles";
import { validateIsNotUndefined } from "@/utils/validations";
import { PiChatsCircle } from "react-icons/pi";
import { useParams } from "react-router-dom";

/**
 * ChatPanel component that handles displaying and sending messages in a chat.
 *
 * @returns {JSX.Element} - The rendered chat panel component.
 */
const ChatPanel = () => {
    const classes = styles();
    const { chatId } = useParams();
    let data;

    try {
        const { chatId: validatedChatId } = validateIsNotUndefined({ chatId });
        data = useChat(validatedChatId);
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading messages: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />
    }

    const {
        text,
        chats,
        signedUserId,
        recipientId,
        recipientName,
        messageList,
        messageCount,
        isError,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        handeSendMessgae,
        handleInputChange,
        handleDeleteChat,
        isInputEnabled,
    } = data;

    if (isError) throw new Error("(!) unhandled error on chat service");
    if (!chats.data?.length) return <Placeholder Icon={PiChatsCircle} message="there's no messages, start a chat" type="h4" />;

    /**
     * Renders the appropriate result based on the current chat state.
     *
     * @returns {JSX.Element} - The rendered messages list or a loading/error message.
     */
    const RenderResult = () => {
        if (isLoading || !messageList) return <Typography className="system-message" ta="center">loading messages ...</Typography>;
        if (chatId === null) return <Typography className="system-message" ta="center">you have no messages yet</Typography>;
        if (messageCount === 0) return <Typography className="system-message" ta="center">{`send your first message to `}<strong>{recipientName}</strong></Typography>;
        return <MessagesList
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            signedUserId={signedUserId}
            fetchNextPage={fetchNextPage}
            messages={messageList}
        />
    }

    return (
        <BoxStyled className={classes.chatboard}>
            <ChatHeadline
                userId={recipientId}
                recipientName={recipientName}
                handleDeleteChat={handleDeleteChat} />
            <RenderResult />
            <MessageInput
                value={text}
                onChange={handleInputChange}
                onEnter={handeSendMessgae}
                placeholder="write a message"
                enabled={isInputEnabled}
            />
        </BoxStyled>
    )
}

export default withErrorBoundary(ChatPanel);