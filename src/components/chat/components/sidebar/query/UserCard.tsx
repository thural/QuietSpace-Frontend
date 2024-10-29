import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import styles from "./styles/chatQueryStyles";

import FlexStyled from "@shared/FlexStyled";
import UserAvatar from "@shared/UserAvatar";
import UserDetails from "@shared/UserDetails";
import { toUpperFirstChar } from "@utils/stringUtils";
import { User } from "@/api/schemas/inferred/user";
import { ConsumerFn } from "@/types/genericTypes";

export interface UserCardProps extends GenericWrapper {
    user: User
    handleItemClick: ConsumerFn
}

const UserCard: React.FC<UserCardProps> = ({ data: user, handleItemClick, children }) => {

    const classes = styles();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        handleItemClick(event, user);
    }

    return (
        <FlexStyled className={classes.queryCard} onClick={handleClick}>
            <UserAvatar size="2.5rem" radius="10rem" chars={toUpperFirstChar(user.username)} />
            <UserDetails user={user} scale={5} />
            {children}
        </FlexStyled>
    )
}

export default UserCard