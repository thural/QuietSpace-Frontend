import { ResId } from "@/api/schemas/native/common";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import styles from "@/styles/chat/chatHeadlineStyles";
import { ConsumerFn } from "@/types/genericTypes";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import ChatMenu from "./ChatMenu";

interface ChatHeadlineProps {
    userId: ResId
    recipientName: string
    handleDeleteChat: ConsumerFn
}

const ChatHeadline: React.FC<ChatHeadlineProps> = ({ userId, recipientName, handleDeleteChat }) => {

    const classes = styles();

    return (
        <FlexStyled className={classes.chatHeadline}>
            <UserAvatarPhoto userId={userId} />
            <Typography className="title" type="h5">{recipientName}</Typography>
            <ChatMenu handleDeleteChat={handleDeleteChat} isMutable={true} />
        </FlexStyled>
    )
}

export default ChatHeadline