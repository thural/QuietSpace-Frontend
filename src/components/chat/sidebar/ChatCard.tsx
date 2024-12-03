import { ChatResponse } from "@/api/schemas/inferred/chat";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import styles from "@/styles/chat/chatCardStyles";
import useChatCard from "@/styles/chat/useChatCard";
import BoxStyled from "@shared/BoxStyled";
import Typography from "@shared/Typography";
import { useParams } from "react-router-dom";

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
            <UserAvatarPhoto userId={contactId} />
            <BoxStyled className={classes.chatDetails} style={appliedStyle}>
                <Typography size="sm" lineClamp={1}>{username}</Typography>
                <Typography size="xs" lineClamp={1}>{recentText}</Typography>
            </BoxStyled>
        </BoxStyled>
    );
};

export default ChatCard