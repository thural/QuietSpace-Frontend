import { toUpperFirstChar } from "../../utils/stringUtils";
import FlexStyled from "../Shared/FlexStyled";
import Typography from "../Shared/Typography";
import UserAvatar from "../Shared/UserAvatar";
import ChatMenu from "./ChatMenu";
import styles from "./styles/chatHeadlineStyles";

const ChatHeadline = ({ recipientName, handleDeleteChat }) => {

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