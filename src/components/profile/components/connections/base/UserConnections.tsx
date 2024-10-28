import { Center } from "@mantine/core";
import React from "react";

import BoxStyled from "@/components/shared/BoxStyled";
import Typography from "@/components/shared/Typography";
import UserList from "../list/UserList";
import SearchBar from "../searchbar/SearchBar";
import styles from "./styles/connectionStyles";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { ConnectionsProps } from "./types/userConnectionsTypes";
import useUserConnection from "./hooks/useUserConnections";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";


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


    return (
        <BoxStyled className={classes.container} >
            <Center><Typography type="h3">{title}</Typography></Center>
            <SearchBar
                handleInputBlur={handleInputBlur}
                handleInputChange={handleInputChange}
                handleInputFocus={handleInputFocus}
            />
            <UserList userFetch={userFetch} queryResult={queryResult} handleItemClick={handleItemClick} />
        </BoxStyled>
    )
}

export default withErrorBoundary(UserConnections);