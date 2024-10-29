import BoxStyled from "@/components/shared/BoxStyled";
import ChatHeadline from "../headline/ChatHeadline";
import MessageInput from "../input/MessageInput";
import MessagesList from "../list/MessageList";
import { useChat } from "./hooks/useChat";
import styles from "./styles/chatPanelStyles";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import Typography from "@/components/shared/Typography";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import { useParams } from "react-router-dom";
import Placeholder from "../placeholder/ChatPlaceHolder";
import { PiChatsCircle } from "react-icons/pi";

const ChatPanel: React.FC<GenericWrapper> = () => {

    const classes = styles();
    const { chatId } = useParams();

    if (chatId === undefined) return <Placeholder Icon={PiChatsCircle} message="start a chat" type="h3" />;

    let data = undefined;

    try {
        data = useChat();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading messages: ${(error as Error).message}`
        return <ErrorComponent message={errorMessage} />
    }

    const {
        chats,
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
    if (!chats?.length) return <Placeholder Icon={PiChatsCircle} message="there's no messages, start a chat" type="h4" />;
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