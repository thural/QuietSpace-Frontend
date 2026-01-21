import { ChatResponse } from "@/features/chat/data/models/chat";
import BoxStyled from "@/shared/BoxStyled";
import Typography from "@/shared/Typography";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import styles from "../../styles/chatSidebarStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
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