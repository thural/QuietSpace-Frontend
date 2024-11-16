import { Center } from "@mantine/core";
import React from "react";

import BoxStyled from "@/components/shared/BoxStyled";
import Typography from "@/components/shared/Typography";
import UserQueryList from "../list/UserQueryList";
import SearchBar from "../searchbar/SearchBar";
import styles from "./styles/connectionStyles";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { ConnectionsProps } from "./types/userConnectionsTypes";
import useUserConnection from "./hooks/useUserConnection";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import UserQueryItem from "@/components/shared/UserQueryItem";
import { User } from "@/api/schemas/inferred/user";


const UserConnections: React.FC<ConnectionsProps> = ({ userFetch, title }) => {

    const classes = styles();

    if (userFetch.isLoading) return <FullLoadingOverlay />

    const {
        queryResult,
        handleInputChange,
        handleItemClick,
        handleInputFocus,
        handleInputBlur
    } = useUserConnection(userFetch);



    const UserItem = ({ data }: { data: User }) => (<UserQueryItem data={data} />);

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