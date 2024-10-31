import ChatCard from "../card/ChatCard";
import ChatQuery from "../query/ChatQuery";
import styles from "./styles/chatSidebarStyles";
import BoxStyled from "@/components/shared/BoxStyled";
import ComponentList from "@/components/shared/ComponentList";
import Typography from "@/components/shared/Typography";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import { getChatsCache } from "@/api/queries/chatQueries";

const ChatSidebar: React.FC<GenericWrapper> = () => {

    const classes = styles();

    const chats = getChatsCache();
    if (chats === undefined) throw new Error("(!) chat list is undefined");


    const RenderResult = () => {
        return (chats?.length > 0) ?
            <ComponentList list={chats} Component={ChatCard} />
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