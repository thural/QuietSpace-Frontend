import BoxStyled from "@shared/BoxStyled";
import ComponentList from "@shared/ComponentList";
import Typography from "@shared/Typography";
import { useQueryClient } from "@tanstack/react-query";
import ChatCard from "./ChatCard";
import ChatQuery from "./ChatQuery";
import styles from "./styles/chatContainerStyles";

const ChatContainer = () => {

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

export default ChatContainer