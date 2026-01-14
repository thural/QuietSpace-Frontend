import { ChatResponse } from "@/api/schemas/inferred/chat";
import BoxStyled from "@/components/shared/BoxStyled";
import Typography from "@/components/shared/Typography";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/chat/chatSidebarStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import ChatCard from "./ChatCard";
import ChatQuery from "./ChatQuery";

interface ChatSidebarProps extends GenericWrapper {
    chats: Array<ChatResponse>
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chats }) => {

    const classes = styles();


    const ChatList = () => {
        return (chats?.length > 0) ?
            chats.map((chat, key) => <ChatCard key={key} chat={chat} />)
            : <Typography ta="center">there's no chat yet</Typography>
    }


    return (
        <BoxStyled className={classes.chatContainer}>
            <ChatQuery />
            <ChatList />
        </BoxStyled>
    )
}

export default withErrorBoundary(ChatSidebar);