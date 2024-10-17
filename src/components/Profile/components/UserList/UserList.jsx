import BoxStyled from "@shared/BoxStyled";
import ComponentList from "@shared/ComponentList";
import FullLoadingOverlay from "@shared/FullLoadingOverlay";
import Typography from "@shared/Typography";
import UserQueryItem from "@shared/UserQueryItem";
import styles from "./userListStyles";

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