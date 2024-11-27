import { ChatResponse } from "@/api/schemas/inferred/chat";
import BoxStyled from "@shared/BoxStyled";
import Typography from "@shared/Typography";
import UserAvatar from "@shared/UserAvatar";
import { toUpperFirstChar } from "@utils/stringUtils";
import { useParams } from "react-router-dom";
import useChatCard from "@/styles/chat/useChatCard";
import styles from "@/styles/chat/chatCardStyles";

const ChatCard: React.FC<{ chat: ChatResponse }> = ({ chat }) => {

    const classes = styles();

    const { chatId } = useParams();

    const {
        contactId,
        username,
        recentText,
        handleClick,
        appliedStyle,
    } = useChatCard(chat);


    const cardStyle = chatId == chat.id ? { background: "#e2e8f0" } : {};

    return (
        <BoxStyled id={contactId} className={classes.chatCard} onClick={handleClick} style={cardStyle}>
            <UserAvatar chars={toUpperFirstChar(username)} />
            <BoxStyled className={classes.chatDetails} style={appliedStyle}>
                <Typography size="sm" lineClamp={1}>{username}</Typography>
                <Typography size="xs" lineClamp={1}>{recentText}</Typography>
            </BoxStyled>
        </BoxStyled>
    );
};

export default ChatCard