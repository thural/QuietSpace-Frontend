import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../../../hooks/zustand";

const useChat = (chat) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { setActiveChatId } = useChatStore();

    const contactId = chat.userIds.find(userId => userId !== user.id);
    const username = chat.members[0]["username"];
    const recentText = chat.recentMessage ? chat.recentMessage.text : "chat is empty";

    const handleClick = () => {
        setActiveChatId(chat.id);
    };

    const isNotseen = !chat?.recentMessage?.isSeen && chat?.recentMessage?.senderId !== user.id;
    const appliedStyle = isNotseen ? { fontWeight: 500 } : {};

    return {
        contactId,
        username,
        recentText,
        handleClick,
        appliedStyle,
    };
};

export default useChat;