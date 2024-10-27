import { useGetChatsByUserId } from "@/services/data/useChatData";
import { useChatStore } from "@/services/store/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import ChatPanel from "../components/message/panel/ChatPanel"
import ChatSidebar from "../components/sidebar/panel/ChatSidebar"
import styles from "./styles/chatContainerStyles";
import { User } from "@/api/schemas/inferred/user";
import DefaultContainer from "@/components/shared/DefaultContainer";
import Typography from "@/components/shared/Typography";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { ChatList } from "@/api/schemas/inferred/chat";
import { nullishValidationdError } from "@/utils/errorUtils";

const ChatContainer = () => {

    const classes = styles();

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    const chats: ChatList | undefined = queryClient.getQueryData(["chats"]);

    if (!user || !chats) throw nullishValidationdError({ user, chats });

    const { data: { activeChatId }, setActiveChatId } = useChatStore();
    const { isLoading, isError, isSuccess } = useGetChatsByUserId(user.id);


    useEffect(() => {
        if (!isSuccess || activeChatId !== null) return;
        const firstChatId = chats[0].id;
        setActiveChatId(String(firstChatId));
    }, [chats]);


    if (isLoading) return <FullLoadingOverlay />;
    if (isError) return <Typography type="h1">{'(!) could not fetch chat data!'}</Typography>
    if ((!isSuccess || activeChatId == null)) return null;

    return (
        <DefaultContainer className={classes.container}>
            <ChatSidebar className={classes.contacts} />
            <ChatPanel className={classes.messages} />
        </DefaultContainer>
    )
}

export default ChatContainer