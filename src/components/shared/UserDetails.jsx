import BoxStyled from "./BoxStyled";
import styles from "./styles/userDetailsStyles";
import Typography from "./Typography";

const UserDetails = ({ user, scale = 3, children }) => {

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

    const heading = `h${size}`;

    console.log("UserDetails heading and fontSize: ", heading, fontSize);

    return (
        <BoxStyled key={user.id} className={classes.userDetails}>
            <Typography type={heading} className="username">{user.username}</Typography>
            <Typography style={{ fontSize }} lineClamp={1} truncate="end" className="email">{user.email}</Typography>
            {children}
        </BoxStyled>
    )
};

export default UserDetails