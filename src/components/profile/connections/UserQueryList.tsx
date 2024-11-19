import BoxStyled from "@/components/shared/BoxStyled";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import Typography from "@/components/shared/Typography";
import React, { JSXElementConstructor } from "react";
import styles from "@/styles/profile/userListStyles";
import { UseQueryResult } from "@tanstack/react-query";
import { UserList, UserPage } from "@/api/schemas/inferred/user";
import { GenericWrapper } from "@/types/sharedComponentTypes";

export interface UserListProps extends GenericWrapper {
    userFetch: UseQueryResult<UserPage>
    queryResult: UserList
    itemProps?: Object
    Item: JSXElementConstructor<any>
}

const UserQueryList: React.FC<UserListProps> = ({ userFetch, queryResult, Item }) => {

    const classes = styles();

    const RenderResult = () => (
        userFetch.isPending ? <FullLoadingOverlay />
            : userFetch.isError ? <Typography type="h1">{userFetch.error.message}</Typography>
                : queryResult.map((data, key) => <Item key={key} data={data} />)
    )

    return <BoxStyled className={classes.resultContainer}><RenderResult /></BoxStyled>
}

export default UserQueryList