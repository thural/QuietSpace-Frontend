import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import UserAvatar from "@shared/UserAvatar";
import { toUpperFirstChar } from "@utils/stringUtils";
import ChatMenu from "./ChatMenu";
import styles from "@/styles/chat/chatHeadlineStyles";
import { ConsumerFn } from "@/types/genericTypes";

interface ChatHeadlineProps {
    recipientName: string
    handleDeleteChat: ConsumerFn
}

const ChatHeadline: React.FC<ChatHeadlineProps> = ({ recipientName, handleDeleteChat }) => {

    const classes = styles();

    return (
        <FlexStyled className={classes.chatHeadline}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(recipientName)} />
            <Typography className="title" type="h5">{recipientName}</Typography>
            <ChatMenu handleDeleteChat={handleDeleteChat} isMutable={true} />
        </FlexStyled>
    )
}

export default ChatHeadline