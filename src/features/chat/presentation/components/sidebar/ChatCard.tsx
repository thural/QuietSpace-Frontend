import { ChatResponse } from "@/api/schemas/inferred/chat";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import styles from "@/styles/chat/chatCardStyles";
import useChatCard from "@/styles/chat/useChatCard";
import BoxStyled from "@shared/BoxStyled";
import Typography from "@shared/Typography";
import { useParams } from "react-router-dom";

const ChatCard: React.FC<{ chat: ChatResponse }> = ({ chat }) => {


    const { chatId } = useParams();

    const {
        contactId,
        username,
        recentText,
        handleClick,
        appliedStyle,
    } = useChatCard(chat);


    const isSelected = chatId == chat.id;

    const classes = styles(isSelected);

    return (
        <BoxStyled id={contactId} className={classes.chatCard} onClick={handleClick}>
            <UserAvatarPhoto userId={contactId} />
            <BoxStyled className={classes.chatDetails} style={appliedStyle}>
                <Typography size="sm" lineClamp={1}>{username}</Typography>
                <Typography size="xs" lineClamp={1}>{recentText}</Typography>
            </BoxStyled>
        </BoxStyled>
    );
};

export default ChatCard