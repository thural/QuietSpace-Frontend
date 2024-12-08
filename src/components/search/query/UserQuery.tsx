import { UserList, UserPage } from "@/api/schemas/inferred/user";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import LoaderStyled from "@/components/shared/LoaderStyled";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import BoxStyled from "@components/shared/BoxStyled";
import UserQueryItem from "@components/shared/UserQueryItem";
import { UseMutationResult } from "@tanstack/react-query";
import React, { CSSProperties } from "react";
import styles from "@/styles/search/queryResultStyles";

export interface UserQueryProps extends GenericWrapper {
    fetchUserQuery: UseMutationResult<UserPage, Error, string>
    userQueryList: UserList
    style?: CSSProperties
}

const UserQuery: React.FC<UserQueryProps> = ({ fetchUserQuery, userQueryList, style }) => {

    const classes = styles();

    const RenderResult = () => (
        fetchUserQuery.isPending ? <LoaderStyled />
            : fetchUserQuery.isError ? <ErrorComponent message={fetchUserQuery.error.message} />
                : userQueryList.map((user, key) => <UserQueryItem key={key} data={user} />)
    )

    return (
        <BoxStyled className={classes.resultContainer} style={style} >
            <RenderResult />
        </BoxStyled>
    )
};

export default UserQuery