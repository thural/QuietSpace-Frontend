import BoxStyled from "@shared/BoxStyled";
import ComponentList from "@shared/ComponentList";
import Typography from "@shared/Typography";
import { useQueryClient } from "@tanstack/react-query";
import ChatCard from "./components/ChatCard/ChatCard";
import ChatQuery from "./components/ChatQuery/ChatQuery";
import styles from "./styles/chatSidebarStyles";

const ChatSidebar = () => {

    const classes = styles();

    const queryClient = useQueryClient();
    const chats = queryClient.getQueryData(["chats"]);


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

export default ChatSidebar