import BoxStyled from "@/components/shared/BoxStyled";
import ChatHeadline from "../headline/ChatHeadline";
import MessageInput from "../input/MessageInput";
import MessagesList from "../list/MessageList";
import { useChat } from "./hooks/useChat";
import styles from "./styles/chatPanelStyles";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import Typography from "@/components/shared/Typography";

const ChatPanel: React.FC<GenericWrapper> = () => {

    const classes = styles();

    const {
        chats,
        activeChatId,
        recipientName,
        messages,
        isError,
        isLoading,
        sendMessage,
        inputData,
        handleInputChange,
        handleDeleteChat,
        isEnabled
    } = useChat();

    if (!chats?.length) return <Typography style={{ margin: "1rem" }} ta="center">there's no messages yet</Typography>;
    if (isLoading) return <Typography className="system-message" ta="center">loading messages ...</Typography>;
    if (isError) return <Typography className="system-message" ta="center">error loading messages</Typography>;
    if (activeChatId === null) return <Typography className="system-message" ta="center">you have no messages yet</Typography>;
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

export default ChatPanel