import BoxStyled from "../Shared/BoxStyled";
import ComponentList from "../Shared/ComponentList";
import FullLoadingOverlay from "../Shared/FullLoadingOverlay";
import Typography from "../Shared/Typography";
import UserQueryItem from "../Shared/UserQueryItem";
import styles from "./styles/userListStyles";

const UserList = ({ userFetch, handleItemClick, queryResult }) => {

    const classes = styles();

    const RenderResult = () => (
        userFetch.isPending ? <FullLoadingOverlay />
            : userFetch.isError ? <Typography type="h1">{userFetch.error.message}</Typography>
                : <ComponentList Component={UserQueryItem} list={queryResult} handleItemClick={handleItemClick} />
    )

    return <BoxStyled className={classes.resultContainer}><RenderResult /></BoxStyled>
}

export default UserList