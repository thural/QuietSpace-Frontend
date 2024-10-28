import BoxStyled from "@/components/shared/BoxStyled";
import ChatHeadline from "../headline/ChatHeadline";
import MessageInput from "../input/MessageInput";
import MessagesList from "../list/MessageList";
import { useChat } from "./hooks/useChat";
import styles from "./styles/chatPanelStyles";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import Typography from "@/components/shared/Typography";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";

const ChatPanel: React.FC<GenericWrapper> = () => {

    const classes = styles();
    let data = undefined;

    try {
        data = useChat();
    } catch (error: unknown) {
        console.error(error);
        return <Typography className="system-message" ta="center">error loading messages</Typography>;
    }

    const {
        chats,
        chatId,
        recipientName,
        messages,
        isError,
        isLoading,
        sendMessage,
        inputData,
        handleInputChange,
        handleDeleteChat,
        isEnabled
    } = data;



    if (isError) throw new Error("(!) unhandler error on chat service");
    if (!chats?.length) return <Typography style={{ margin: "1rem" }} ta="center">there's no messages yet</Typography>;
    if (isLoading) return <Typography className="system-message" ta="center">loading messages ...</Typography>;
    if (chatId === null) return <Typography className="system-message" ta="center">you have no messages yet</Typography>;
    if (!messages) return <Typography className="system-message" ta="center">{`send your first message to `}<strong>{recipientName}</strong></Typography>;

    return (
        <BoxStyled className={classes.chatboard}>
            <ChatHeadline
                recipientName={recipientName}
                handleDeleteChat={handleDeleteChat}
            />
            <MessagesList messages={messages} />
            <MessageInput
                value={inputData.text}
                onChange={handleInputChange}
                onEnter={sendMessage}
                placeholder="write a message"
                enabled={isEnabled}
            />
        </BoxStyled>
    )
}

export default withErrorBoundary(ChatPanel);