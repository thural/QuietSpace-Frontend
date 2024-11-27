import { MessageResponse } from "@/api/schemas/inferred/chat";
import { ResId } from "@/api/schemas/native/common";
import PostMessageCard from "@/components/feed/post/PostMessageCard";
import { extractId } from "@/utils/stringUtils";
import BoxStyled from "@shared/BoxStyled";
import MessageBox from "./MessageBox";
import styles from "@/styles/chat/messageListStyles";
import InfinateScrollContainer, { InfinateScrollContainerProps } from "@/components/shared/InfinateScrollContainer";

interface MessageListProps extends InfinateScrollContainerProps {
    messages: Array<MessageResponse>
    signedUserId: ResId
}

const MessagesList: React.FC<MessageListProps> = ({
    messages,
    signedUserId,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
}) => {

    const classes = styles();

    const getAppliedStyle = (senderId: ResId, signedUserId: ResId) => (senderId !== signedUserId) ? {
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
                    return message.text.startsWith("##MP##") ? <PostMessageCard key={key} style={appliedStyle} postId={extractId(message.text)} />
                        : <MessageBox style={appliedStyle} key={key} message={message} />
                })}
            </InfinateScrollContainer>
        </BoxStyled>
    );
};

export default MessagesList