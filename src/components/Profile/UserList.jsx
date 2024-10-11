import { Box } from "@mantine/core";
import FullLoadingOverlay from "../Shared/FillLoadingOverlay";
import UserQueryItem from "../Shared/UserQueryItem";
import styles from "./styles/userListStyles";

const UserList = ({ userFetch, handleItemClick, queryResult }) => {

    const classes = styles();

    console.log("user fetch on connection: ", userFetch.isPending);
    console.log("query result on connections: ", queryResult)

    const RenderResult = () => {
        if (userFetch.isPending) return <FullLoadingOverlay />
        else if (userFetch.isError) return <h1>{userFetch.error.message}</h1>
        else return queryResult.map((user, index) => (
            <UserQueryItem key={index} user={user} handleItemClick={handleItemClick} />
        ));
    }

    return <Box className={classes.resultContainer}><RenderResult /></Box>
}

export default UserList