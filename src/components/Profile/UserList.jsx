import { Box } from "@mantine/core";
import UserQueryItem from "../Shared/UserQueryItem"
import styles from "./styles/userListStyles"

const UserList = ({ userQuery, handleItemClick, followersResult }) => {
    const classes = styles();

    const RenderResult = () => {
        if (userQuery.isPending) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        else if (userQuery.isError) return <h1>{fetchUserQuery.error.message}</h1>
        else followersResult.map((user, index) => <UserQueryItem key={index} user={user} handleItemClick={handleItemClick} />)
    }

    return <Box className={classes.resultContainer}><RenderResult /></Box>
}

export default UserList