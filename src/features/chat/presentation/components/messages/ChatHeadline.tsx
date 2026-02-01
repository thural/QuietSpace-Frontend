import { ResId } from "@/shared/api/models/commonNative";
import { UserProfileAvatarWithData } from "@/shared/ui/components/user";
import { ChatHeadline as ChatHeadlineStyles } from "../../styles/chatHeadlineStyles";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { FlexContainer } from "../../../../../shared/ui/components";
import { Title } from "../../../../../shared/ui/components";
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
    return (
        <ChatHeadlineStyles>
            <UserProfileAvatarWithData userId={userId} size="md" />
            <Title variant="h5" className="title">{recipientName}</Title>
            <ChatMenu handleDeleteChat={handleDeleteChat} isMutable={true} />
        </ChatHeadlineStyles>
    );
}

export default ChatHeadline;