import { Center } from "@mantine/core";
import React from "react";

import { User, UserPage } from "@/api/schemas/inferred/user";
import BoxStyled from "@/components/shared/BoxStyled";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import Typography from "@/components/shared/Typography";
import UserQueryItem from "@/components/shared/UserQueryItem";
import useUserConnection from "@/services/hook/profile/useUserConnection";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/profile/connectionStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import SearchBar from "../searchbar/SearchBar";
import UserQueryList from "./UserQueryList";

export interface ConnectionsProps extends GenericWrapper {
    userFetch: UseInfiniteQueryResult<InfiniteData<UserPage>>,
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