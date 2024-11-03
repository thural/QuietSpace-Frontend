import chatQueries from "@/api/queries/chatQueries";
import BoxStyled from "@/components/shared/BoxStyled";
import Typography from "@/components/shared/Typography";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import ChatCard from "../card/ChatCard";
import ChatQuery from "../query/ChatQuery";
import styles from "./styles/chatSidebarStyles";

const ChatSidebar: React.FC<GenericWrapper> = () => {

    const classes = styles();
    const { getChatsCache } = chatQueries();

    const chats = getChatsCache();
    if (chats === undefined) throw new Error("(!) chat list is undefined");


    const RenderResult = () => {
        return (chats?.length > 0) ?
            chats.map((chat, key) => <ChatCard key={key} chat={chat} />)
            : <Typography ta="center">there's no chat yet</Typography>
    }


    return (
        <BoxStyled className={classes.chatContainer}>
            <ChatQuery />
            <RenderResult />
        </BoxStyled>
    )
}

export default withErrorBoundary(ChatSidebar);