import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { ChatResponse } from "@/api/schemas/inferred/chat";
import { processRecentText } from "@/utils/stringUtils";
import { useNavigate } from "react-router-dom";

const useChatCard = (chat: ChatResponse) => {

    const navigate = useNavigate();
    const handleClick = () => navigate(`/chat/${chat.id}`);


    const user = getSignedUserElseThrow();


    const contactId = chat.userIds.find(userId => userId !== user.id);
    const username: string | undefined = chat.members.find(member => member.id !== user.id)?.username;
    const recentText = processRecentText(chat.recentMessage ? chat.recentMessage.text : "chat is empty");


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