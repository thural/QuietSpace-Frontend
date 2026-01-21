import { MessageResponse } from "@/features/chat/data/models/chat";
import { ResId } from "@/shared/api/models/commonNative";
import PostMessageCard from "@/features/feed/presentation/components/post/PostMessageCard";
import InfinateScrollContainer, { InfinateScrollContainerProps } from "@/shared/InfinateScrollContainer";
import styles from "../../styles/messageListStyles";
import { extractId } from "@/shared/utils/stringUtils";
import BoxStyled from "@shared/BoxStyled";
import MessageBox from "./MessageBox";

/**
 * Props for the MessagesList component, extending InfinateScrollContainerProps.
 *
 * @interface MessageListProps
 * @extends InfinateScrollContainerProps
 * @property {Array<MessageResponse>} messages - The array of message objects to display.
 * @property {ResId} signedUserId - The ID of the signed-in user for styling purposes.
 */
interface MessageListProps extends InfinateScrollContainerProps {
    messages: Array<MessageResponse>;
    signedUserId: ResId;
}

/**
 * MessagesList component that renders a list of messages with infinite scrolling.
 *
 * @param {MessageListProps} props - The props for the MessagesList component.
 * @returns {JSX.Element} - The rendered messages list component.
 */
const MessagesList: React.FC<MessageListProps> = ({
    messages,
    signedUserId,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
}) => {
    const classes = styles();

    /**
     * Determines the style to apply based on the sender ID.
     *
     * @param {ResId} senderId - The ID of the message sender.
     * @param {ResId} signedUserId - The ID of the signed-in user.
     * @returns {React.CSSProperties} - The style object to apply to the message box.
     */
    const getAppliedStyle = (senderId: ResId, signedUserId: ResId): React.CSSProperties =>
        (senderId !== signedUserId) ? {
            marginRight: "auto",
            borderRadius: '1.25rem 1.25rem 1.25rem 0rem',
        } : {
            marginLeft: "auto",
            color: "white",
            borderColor: "blue",
            backgroundColor: "#3c3cff",
            borderRadius: '1rem 1rem 0rem 1rem'
        };

    return (
        <BoxStyled className={classes.messages}>
            <InfinateScrollContainer
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
            >
                {messages.map((message, key) => {
                    const appliedStyle = getAppliedStyle(message.senderId, signedUserId);
                    return message.text.startsWith("##MP##") ? (
                        <PostMessageCard key={key} style={appliedStyle} postId={extractId(message.text)} />
                    ) : (
                        <MessageBox style={appliedStyle} key={key} message={message} />
                    );
                })}
            </InfinateScrollContainer>
        </BoxStyled>
    );
};

export default MessagesList;