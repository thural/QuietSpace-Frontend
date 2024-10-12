import { Box, LoadingOverlay } from "@mantine/core";
import UserQueryItem from "../Shared/UserQueryItem";
import styles from "./styles/userQueryStyles";
import FullLoadingOverlay from "../Shared/FillLoadingOverlay";

const UserQuery = ({ handleItemClick, fetchUserQuery, userQueryList, style }) => {

    const classes = styles();

    const UserList = ({ resultList }) => (
        resultList.map((user, index) =>
            <UserQueryItem key={index} user={user} handleItemClick={handleItemClick} />)
    );

    const RenderResult = () => {
        if (fetchUserQuery.isPending)
            return <FullLoadingOverlay />;
        else if (fetchUserQuery.isError) return <h1>{fetchUserQuery.error.message}</h1>;
        return <UserList resultList={userQueryList} />;
    }

    return (
        <Box className={classes.resultContainer} style={style} ><RenderResult /></Box>
    )
};

export default UserQuery