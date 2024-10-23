import { useGetChatsByUserId } from "@/hooks/data/useChatData";
import { useChatStore } from "@/hooks/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import ChatPanel from "../components/message/panel/ChatPanel"
import ChatSidebar from "../components/sidebar/panel/ChatSidebar"
import styles from "./styles/chatContainerStyles";
import { UserSchema } from "@/api/schemas/user";
import DefaultContainer from "@/components/shared/DefaultContainer";
import Typography from "@/components/shared/Typography";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { ChatResponseList } from "@/api/schemas/chat";
import { produceUndefinedError } from "@/utils/errorUtils";

const ChatContainer = () => {

    const classes = styles();

    const queryClient = useQueryClient();
    const user: UserSchema | undefined = queryClient.getQueryData(["user"]);
    const chats: ChatResponseList | undefined = queryClient.getQueryData(["chats"]);

    if (user === undefined || chats === undefined) throw produceUndefinedError({ user, chats });

    const { data: { activeChatId }, setActiveChatId } = useChatStore();
    const { isLoading, isError, isSuccess } = useGetChatsByUserId(user.id);


    useEffect(() => {
        if (!isSuccess || activeChatId !== null) return;
        const firstChatId = chats[0]?.id;
        setActiveChatId(firstChatId);
    }, [chats]);


    if (isLoading) return <FullLoadingOverlay />;
    if (isError) return <Typography type="h1">{'Could not fetch chat data! 🔥'}</Typography>
    if ((!isSuccess || activeChatId == null)) return null;

    return (
        <DefaultContainer className={classes.container}>
            <ChatSidebar className={classes.contacts} />
            <ChatPanel className={classes.messages} />
        </DefaultContainer>
    )
}

export default ChatContainer