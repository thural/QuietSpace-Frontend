import BoxStyled from "@/components/shared/BoxStyled";
import ComponentList from "@/components/shared/ComponentList";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import Typography from "@/components/shared/Typography";
import UserQueryItem from "@/components/shared/UserQueryItem";
import styles from "./styles/userListStyles";
import React from "react";
import { UserListProps } from "./types/userListTypes";



const UserList: React.FC<UserListProps> = ({ userFetch, handleItemClick, queryResult }) => {

    const classes = styles();

    const RenderResult = () => (
        userFetch.isPending ? <FullLoadingOverlay />
            : userFetch.isError ? <Typography type="h1">{userFetch.error.message}</Typography>
                : <ComponentList Component={UserQueryItem} list={queryResult} handleItemClick={handleItemClick} />
    )

    return <BoxStyled className={classes.resultContainer}><RenderResult /></BoxStyled>
}

export default UserList