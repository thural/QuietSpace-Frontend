import BoxStyled from "@shared/BoxStyled";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import UserAvatar from "@shared/UserAvatar";
import { toUpperFirstChar } from "@utils/stringUtils";
import styles from "./styles/profileContainerStyles";

const UserDetailsSection = ({ user }) => {

    const classes = styles();

    return (
        <FlexStyled className={classes.identitySection}>
            <BoxStyled className="profileName"><Typography fw={700}>{user.username}</Typography></BoxStyled>
            <UserAvatar size="4.5rem" chars={toUpperFirstChar(user.username)} />
        </FlexStyled>
    )
};

export default UserDetailsSection