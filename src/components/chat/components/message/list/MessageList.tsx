import { MessageList } from "@/api/schemas/inferred/chat";
import BoxStyled from "@shared/BoxStyled";
import MessageBox from "../base/MessageBox";
import styles from "./styles/messageListStyles";
import PostMessageCard from "@/components/feed/components/post/card/PostMessageCard";
import { extractId } from "@/utils/stringUtils";

const MessagesList = ({ messages }: { messages: MessageList }) => {

    const classes = styles();



    return (
        <BoxStyled className={classes.messages}>
            {messages.map((message, key) =>
                message.text.startsWith("##MP##") ? <PostMessageCard postId={extractId(message.text)} />
                    : <MessageBox key={key} message={message} />
            )}
        </BoxStyled>
    );
};

export default MessagesList