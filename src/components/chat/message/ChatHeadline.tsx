import { ResId } from "@/api/schemas/native/common";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import styles from "@/styles/chat/chatHeadlineStyles";
import { ConsumerFn } from "@/types/genericTypes";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import ChatMenu from "./ChatMenu";

/**
 * Props for the ChatHeadline component.
 *
 * @interface ChatHeadlineProps
 * @property {ResId} userId - The ID of the user whose avatar will be displayed.
 * @property {string} recipientName - The name of the chat recipient.
 * @property {ConsumerFn} handleDeleteChat - Function to handle chat deletion.
 */
interface ChatHeadlineProps {
    userId: ResId;
    recipientName: string;
    handleDeleteChat: ConsumerFn;
}

/**
 * ChatHeadline component displays the chat header with the recipient's avatar and name.
 *
 * @param {ChatHeadlineProps} props - The props for the ChatHeadline component.
 * @returns {JSX.Element} - The rendered chat headline component.
 */
const ChatHeadline: React.FC<ChatHeadlineProps> = ({ userId, recipientName, handleDeleteChat }) => {
    const classes = styles();

    return (
        <FlexStyled className={classes.chatHeadline}>
            <UserAvatarPhoto userId={userId} />
            <Typography className="title" type="h5">{recipientName}</Typography>
            <ChatMenu handleDeleteChat={handleDeleteChat} isMutable={true} />
        </FlexStyled>
    );
}

export default ChatHeadline;