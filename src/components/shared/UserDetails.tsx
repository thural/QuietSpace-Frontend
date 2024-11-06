import { User } from "@/api/schemas/inferred/user";
import BoxStyled from "./BoxStyled";
import styles from "./styles/userDetailsStyles";
import { GenericWrapper } from "./types/sharedComponentTypes";
import Typography, { headingSize } from "./Typography";
import Conditional from "./Conditional";

interface UserDetailsProps extends GenericWrapper {
    user: User
    isDisplayEmail?: boolean
    isDisplayName?: boolean
    scale?: number
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, scale = 3, isDisplayEmail = true, isDisplayName = true, children }) => {

    const classes = styles();

    const size = (() => {
        if (typeof scale !== "number") return 3;
        return scale < 1 ? 1 : scale > 6 ? 6 : scale;
    })();

    const fontSize = (() => {
        const value = 3 / size;
        const normalizedSize = value < 0.8 ? 0.8 : value > 2 ? 2 : value;
        return `${normalizedSize}rem`
    })();

    const heading: headingSize = `h${size}`;


    return (
        <BoxStyled key={user.id} className={classes.userDetails}>
            <Conditional isEnabled={isDisplayName}>
                <Typography type={heading} className="username">{user.username}</Typography>
            </Conditional>
            <Conditional isEnabled={isDisplayEmail}>
                <Typography style={{ fontSize }} lineClamp={1} truncate="end" className="email">{user.email}</Typography>
            </Conditional>
            {children}
        </BoxStyled>
    )
};

export default UserDetails