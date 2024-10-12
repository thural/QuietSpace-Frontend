import { useQueryClient } from "@tanstack/react-query";
import BoxStyled from "../Shared/BoxStyled";
import Typography from "../Shared/Typography";
import Chat from "./Chat";
import QueryContainer from "./QueryContainer";
import styles from "./styles/contactContainerStyles";

const ChatContainer = () => {

    const classes = styles();

    const queryClient = useQueryClient();
    const chats = queryClient.getQueryData(["chats"]);


    const RenderResult = () => {
        return (chats?.length > 0) ?
            chats.map((chat, index) => <Chat key={index} chat={chat} />)
            : <Typography ta="center">there's no chat yet</Typography>
    }


    return (
        <BoxStyled className={classes.contacts}>
            <QueryContainer />
            <RenderResult />
        </BoxStyled>
    )
}

export default ChatContainer