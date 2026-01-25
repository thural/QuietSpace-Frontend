import { ChatResponse } from "@/features/chat/data/models/chat";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import styles from "../../styles/chatCardStyles";
import useChatCard from "../../styles/useChatCard";
import { Container } from "@/shared/ui/components/layout/Container";
import { FlexContainer } from "@/shared/ui/components/layout/FlexContainer";
import Typography from "@shared/Typography";
import { useParams } from "react-router-dom";

const ChatCard: React.FC<{
    chat: ChatResponse
    isSelected?: boolean
    onClick?: () => void
}> = ({ chat, isSelected = false, onClick }) => {


    const { chatId } = useParams();
    const isCurrentlySelected = chatId == chat.id;
    const isActuallySelected = isSelected || isCurrentlySelected;

    const {
        contactId,
        username,
        recentText,
        handleClick: defaultHandleClick,
        appliedStyle,
    } = useChatCard(chat);

    const handleClick = onClick || defaultHandleClick;

    const classes = styles(isActuallySelected);

    return (
        <Container id={contactId} className={classes.chatCard} onClick={handleClick}>
            <UserAvatarPhoto userId={contactId} />
            <FlexContainer className={classes.chatDetails} style={appliedStyle}>
                <Typography size="sm" lineClamp={1}>{username}</Typography>
                <Typography size="xs" lineClamp={1}>{recentText}</Typography>
            </FlexContainer>
        </Container>
    );
};

export default ChatCard