import { Center } from "@mantine/core";
import React from "react";

import { UserPage, UserResponse } from "@/features/profile/data/models/user";
import BoxStyled from "@/shared/BoxStyled";
import LoaderStyled from "@/shared/LoaderStyled";
import Typography from "@/shared/Typography";
import UserQueryItem from "@/shared/UserQueryItem";
import useUserConnection from "@features/feed/application/hooks/useUserConnection";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import styles from "./styles/connectionStyles";
import { MouseEventFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import SearchBar from "../searchbar/SearchBar";
import UserQueryList from "./UserQueryList";

/**
 * ConnectionsProps interface.
 * 
 * This interface defines the props for the UserConnections component.
 * 
 * @property {UseInfiniteQueryResult<InfiniteData<UserPage>>} userFetch - The user data fetched using infinite scrolling.
 * @property {string} title - The title to display for the connections section.
 * @property {MouseEventFn} toggleView - Function to handle item click events.
 */
export interface ConnectionsProps extends GenericWrapper {
    userFetch: UseInfiniteQueryResult<InfiniteData<UserPage>>,
    title: string,
    toggleView: MouseEventFn,
}

/**
 * UserConnections component.
 * 
 * This component displays a list of user connections with a search bar for filtering.
 * It uses infinite scrolling to load more user connections as needed. 
 * If the userFetch data is loading, a loader is displayed. 
 * The component allows toggling between views for user items.
 * 
 * @param {ConnectionsProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserConnections component.
 */
const UserConnections: React.FC<ConnectionsProps> = ({ userFetch, title, toggleView }) => {
    const classes = styles();

    // Display a loader while userFetch is loading
    if (userFetch.isLoading) return <LoaderStyled />;

    const {
        queryResult,
        handleInputChange,
        handleInputFocus,
        handleInputBlur
    } = useUserConnection(userFetch);

    /**
     * UserItem component.
     * 
     * This component renders a single user query item.
     * 
     * @param {Object} data - The user data to display.
     * @returns {JSX.Element} - The rendered UserQueryItem component.
     */
    const UserItem: React.FC<{ data: UserResponse }> = ({ data }) =>
        <UserQueryItem data={data} handleItemClick={toggleView} />;

    // TODO: Convert container to reusable secondary modal
    return (
        <BoxStyled className={classes.container}>
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
    );
}

export default withErrorBoundary(UserConnections);