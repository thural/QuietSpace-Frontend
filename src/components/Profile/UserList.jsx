import BoxStyled from "../Shared/BoxStyled";
import FullLoadingOverlay from "../Shared/FullLoadingOverlay";
import Typography from "../Shared/Typography";
import UserQueryItem from "../Shared/UserQueryItem";
import styles from "./styles/userListStyles";

const UserList = ({ userFetch, handleItemClick, queryResult }) => {

    const classes = styles();

    const UserQueryList = ({ list, handleItemClick }) => {
        list.map((user, index) => (
            <UserQueryItem key={index} user={user} handleItemClick={handleItemClick} />
        ));
    }

    const RenderResult = () => (
        userFetch.isPending ? <FullLoadingOverlay />
            : userFetch.isError ? <Typography type="h1">{userFetch.error.message}</Typography>
                : <UserQueryList list={queryResult} handleItemClick={handleItemClick} />
    )

    return <BoxStyled className={classes.resultContainer}><RenderResult /></BoxStyled>
}

export default UserList