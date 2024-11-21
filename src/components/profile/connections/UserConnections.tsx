import { Center } from "@mantine/core";
import React from "react";

import BoxStyled from "@/components/shared/BoxStyled";
import Typography from "@/components/shared/Typography";
import UserQueryList from "./UserQueryList";
import SearchBar from "../searchbar/SearchBar";
import styles from "@/styles/profile/connectionStyles";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import useUserConnection from "@/services/hook/profile/useUserConnection";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import UserQueryItem from "@/components/shared/UserQueryItem";
import { User, UserPage } from "@/api/schemas/inferred/user";
import { UseQueryResult } from "@tanstack/react-query";
import { GenericWrapper } from "@/types/sharedComponentTypes";

export interface ConnectionsProps extends GenericWrapper {
    userFetch: UseQueryResult<UserPage>
    title: string
}

const UserConnections: React.FC<ConnectionsProps> = ({ userFetch, title }) => {

    const classes = styles();

    if (userFetch.isLoading) return <FullLoadingOverlay />;

    const {
        queryResult,
        handleInputChange,
        handleItemClick,
        handleInputFocus,
        handleInputBlur
    } = useUserConnection(userFetch);



    const UserItem: React.FC<{ data: User }> = ({ data }) => <UserQueryItem data={data} />;

    return (
        <BoxStyled className={classes.container} >
            <Center><Typography type="h3">{title}</Typography></Center>
            <SearchBar
                handleInputBlur={handleInputBlur}
                handleInputChange={handleInputChange}
                handleInputFocus={handleInputFocus}
            />
            <UserQueryList Item={UserItem} userFetch={userFetch} queryResult={queryResult} handleItemClick={handleItemClick} />
        </BoxStyled>
    )
}

export default withErrorBoundary(UserConnections);