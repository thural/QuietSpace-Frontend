import BoxStyled from "@/components/shared/BoxStyled";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import Typography from "@/components/shared/Typography";
import UserQueryItem from "@/components/shared/UserQueryItem";
import React from "react";
import styles from "./styles/userListStyles";
import { UserListProps } from "./types/userListTypes";



const UserList: React.FC<UserListProps> = ({ userFetch, queryResult }) => {

    const classes = styles();

    const RenderResult = () => (
        userFetch.isPending ? <FullLoadingOverlay />
            : userFetch.isError ? <Typography type="h1">{userFetch.error.message}</Typography>
                : queryResult.map((user, key) => <UserQueryItem key={key} user={user} />)
    )

    return <BoxStyled className={classes.resultContainer}><RenderResult /></BoxStyled>
}

export default UserList