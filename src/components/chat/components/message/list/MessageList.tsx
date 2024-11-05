import { MessageList } from "@/api/schemas/inferred/chat";
import BoxStyled from "@shared/BoxStyled";
import MessageBox from "../base/MessageBox";
import styles from "./styles/messageListStyles";

const MessagesList = ({ messages }: { messages: MessageList }) => {

    const classes = styles();

    return (
        <BoxStyled className={classes.messages}>
            {messages.map((message, key) => <MessageBox key={key} message={message} />)}
        </BoxStyled>
    );
};

export default MessagesList