import BoxStyled from "@/components/shared/BoxStyled";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import Typography from "@/components/shared/Typography";
import { nullishValidationdError } from "@/utils/errorUtils";
import { PiChatsCircle } from "react-icons/pi";
import { useParams } from "react-router-dom";
import ChatHeadline from "../headline/ChatHeadline";
import MessageInput from "../input/MessageInput";
import MessagesList from "../list/MessageList";
import Placeholder from "../placeholder/ChatPlaceHolder";
import { useChat } from "./hooks/useChat";
import styles from "./styles/chatPanelStyles";

const ChatPanel = () => {

    const classes = styles();
    const { chatId } = useParams();


    let data = undefined;

    try {
        if (!chatId) throw nullishValidationdError({ chatId });
        data = useChat(chatId);
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading messages: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />
    }

    const {
        text,
        chats,
        signedUserId,
        recipientName,
        messages,
        isError,
        isLoading,
        handeSendMessgae,
        handleInputChange,
        handleDeleteChat,
        isInputEnabled,
    } = data;



    if (isError) throw new Error("(!) unhandler error on chat service");
    if (!chats.data?.length) return <Placeholder Icon={PiChatsCircle} message="there's no messages, start a chat" type="h4" />;

    const RenderResult = () => {
        if (isLoading) return <Typography className="system-message" ta="center">loading messages ...</Typography>;
        if (chatId === null) return <Typography className="system-message" ta="center">you have no messages yet</Typography>;
        if (messages?.totalElements === 0) return <Typography className="system-message" ta="center">{`send your first message to `}<strong>{recipientName}</strong></Typography>;
        return <MessagesList signedUserId={signedUserId} messages={messages.content} />;
    }


    return (
        <BoxStyled className={classes.chatboard}>
            <ChatHeadline recipientName={recipientName} handleDeleteChat={handleDeleteChat} />
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