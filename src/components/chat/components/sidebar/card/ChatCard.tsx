import BoxStyled from "@shared/BoxStyled";
import Typography from "@shared/Typography";
import UserAvatar from "@shared/UserAvatar";
import { toUpperFirstChar } from "@utils/stringUtils";
import useChatCard from "../panel/hooks/useChatCard";
import styles from "./styles/chatCardStyles";
import { Chat } from "@/api/schemas/inferred/chat";

const ChatCard = ({ data: chat }: { data: Chat }) => {

    const classes = styles();

    const {
        contactId,
        username,
        recentText,
        handleClick,
        appliedStyle,
    } = useChatCard(chat);

    return (
        <BoxStyled id={contactId} className={classes.chatCard} onClick={handleClick}>
            <UserAvatar chars={toUpperFirstChar(username)} />
            <BoxStyled className={classes.chatDetails} style={appliedStyle}>
                <Typography size="sm" lineClamp={1}>{username}</Typography>
                <Typography size="xs" lineClamp={1}>{recentText}</Typography>
            </BoxStyled>
        </BoxStyled>
    );
};

export default ChatCard