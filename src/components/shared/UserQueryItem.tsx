import styles from "./styles/userQueryItemStyles";

import { toUpperFirstChar } from "@utils/stringUtils";
import { useNavigate } from "react-router-dom";
import FlexStyled from "./FlexStyled";
import FollowToggle from "./FollowToggle";
import UserAvatar from "./UserAvatar";
import UserDetails from "./UserDetails";

const UserQueryItem = ({ data: user }) => {

    const classes = styles();
    const navigate = useNavigate();


    const handleClick = (event) => {
        event.preventDefault();
        navigate(`/profile/${user.id}`);
    }


    return (
        <FlexStyled className={classes.userCard} onClick={handleClick}>
            <UserAvatar radius="10rem" chars={toUpperFirstChar(user.username)} />
            <UserDetails user={user} />
            <FollowToggle user={user} />
        </FlexStyled>
    )
}

export default UserQueryItem