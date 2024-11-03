import { MessageList } from "@/api/schemas/inferred/chat";
import BoxStyled from "@shared/BoxStyled";
import MessageBox from "../base/MessageBox";
import styles from "./styles/messageListStyles";

const MessagesList = ({ messages }: { messages: MessageList }) => {

    const classes = styles();

    const MessageList = () => messages.map((message, key) => <MessageBox key={key} message={message} />);

    return (
        <BoxStyled className={classes.messages}>
            <MessageList />
        </BoxStyled>
    );
};

export default MessagesList