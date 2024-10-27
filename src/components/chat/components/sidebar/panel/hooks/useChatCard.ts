import userQueries from "@/api/queries/userQueries";
import { Chat } from "@/api/schemas/inferred/chat";
import { useChatStore } from "@/services/store/zustand";
import { nullishValidationdError } from "@/utils/errorUtils";

const useChatCard = (chat: Chat) => {

    const { getSignedUser } = userQueries();
    const user = getSignedUser();
    if (user === undefined) throw nullishValidationdError({ user });
    const { setActiveChatId } = useChatStore();

    const contactId = chat.userIds.find(userId => userId !== user.id);
    const username: string | undefined = chat.members.find(member => member.id !== user.id)?.username;
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

export default useChatCard;