import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import UserAvatar from "@shared/UserAvatar";
import { toUpperFirstChar } from "@utils/stringUtils";
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