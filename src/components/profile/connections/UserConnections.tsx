import { Center } from "@mantine/core";
import React from "react";

import { UserPage, UserResponse } from "@/api/schemas/inferred/user";
import BoxStyled from "@/components/shared/BoxStyled";
import LoaderStyled from "@/components/shared/LoaderStyled";
import Typography from "@/components/shared/Typography";
import UserQueryItem from "@/components/shared/UserQueryItem";
import useUserConnection from "@/services/hook/profile/useUserConnection";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/profile/connectionStyles";
import { MouseEventFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import SearchBar from "../searchbar/SearchBar";
import UserQueryList from "./UserQueryList";

export interface ConnectionsProps extends GenericWrapper {
    userFetch: UseInfiniteQueryResult<InfiniteData<UserPage>>,
    title: string
    toggleView: MouseEventFn
}

const UserConnections: React.FC<ConnectionsProps> = ({ userFetch, title, toggleView }) => {

    const classes = styles();

    if (userFetch.isLoading) return <LoaderStyled />;

    const {
        queryResult,
        handleInputChange,
        handleInputFocus,
        handleInputBlur
    } = useUserConnection(userFetch);



    const UserItem: React.FC<{ data: UserResponse }> = ({ data }) =>
        <UserQueryItem data={data} handleItemClick={toggleView} />;

    // TODO: convert container to reusable secondary modal
    return (
        <BoxStyled className={classes.container} >
            <Center>
                <Typography type="h3">{title}</Typography>
            </Center>
            <SearchBar
                handleInputBlur={handleInputBlur}
                handleInputChange={handleInputChange}
                handleInputFocus={handleInputFocus}
            />
            <UserQueryList
                Item={UserItem}
                userFetch={userFetch}
                queryResult={queryResult}
            />
        </BoxStyled>
    )
}

export default withErrorBoundary(UserConnections);