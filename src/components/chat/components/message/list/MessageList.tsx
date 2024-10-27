import BoxStyled from "@shared/BoxStyled";
import ComponentList from "@shared/ComponentList";
import MessageBox from "../base/MessageBox";
import styles from "./styles/messageListStyles";
import { MessageList } from "@/api/schemas/inferred/chat";

const MessagesList = ({ messages }: { messages: MessageList }) => {

    const classes = styles();

    return (
        <BoxStyled className={classes.messages}>
            <ComponentList
                list={messages}
                Component={MessageBox}
            />
        </BoxStyled>
    );
};

export default MessagesList