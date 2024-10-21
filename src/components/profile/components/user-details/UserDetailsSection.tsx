import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import UserAvatar from "@/components/shared/UserAvatar";
import { toUpperFirstChar } from "@/utils/stringUtils";
import styles from "./styles/userDetailsSectionStyles";
import { UserDetailsSectionProps } from "./types/userDetailsSectionTypes";

const UserDetailsSection: React.FC<UserDetailsSectionProps> = ({ user }) => {

    const classes = styles();

    return (
        <FlexStyled className={classes.detailsSection}>
            <BoxStyled className="profileName"><Typography fw={700}>{user.username}</Typography></BoxStyled>
            <UserAvatar size="4.5rem" chars={toUpperFirstChar(user.username)} />
        </FlexStyled>
    )
};

export default UserDetailsSection