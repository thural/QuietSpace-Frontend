/**
 * UserResults Component.
 * 
 * Displays search results for users based on the search query.
 * Handles loading, error, and success states appropriately.
 */

import { UserList, UserPage, UserResponse } from "@/features/profile/data/models/user";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import LoaderStyled from "@/shared/LoaderStyled";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import BoxStyled from "@/shared/BoxStyled";
import UserQueryItem from "@/shared/UserQueryItem";
import { UseMutationResult } from "@tanstack/react-query";
import React, { CSSProperties } from "react";
import styles from "@search/presentation/styles/queryResultStyles";

/**
 * UserResultsProps interface.
 * 
 * This interface defines the props for the UserResults component.
 * 
 * @property {UseMutationResult<UserPage, Error, string>} fetchUserQuery - The mutation result containing the status of the user fetching operation.
 * @property {UserList} userQueryList - A list of users to be displayed.
 * @property {CSSProperties} [style] - Optional inline styles for the result container.
 */
export interface UserResultsProps extends GenericWrapper {
    fetchUserQuery: UseMutationResult<UserPage, Error, string>;
    userQueryList: UserList;
    style?: CSSProperties;
}

/**
 * UserResults component.
 * 
 * This component manages the display of a list of users based on the fetching status.
 * It conditionally renders a loading indicator, an error message, or the list of users.
 * 
 * @param props - The component props.
 * @returns The rendered UserResults component based on the fetching state.
 */
const UserResults: React.FC<UserResultsProps> = ({ fetchUserQuery, userQueryList, style }) => {
    const classes = styles(); // Apply custom styles

    /**
     * RenderResult function.
     * 
     * This function handles the conditional rendering of the component based on the fetching state.
     * It displays a loader if the fetching is in progress, an error message if there's an error,
     * or the list of users if the fetching is successful.
     * 
     * @returns The rendered result based on the fetching status.
     */
    const RenderResult = () => (
        fetchUserQuery.isPending ? (
            <LoaderStyled /> // Show loader while data is being fetched
        ) : fetchUserQuery.isError ? (
            <ErrorComponent message={fetchUserQuery.error.message} /> // Display error message
        ) : (
            // Render the list of users if fetching is successful
            userQueryList?.map((user: UserResponse, index: number) => (
                <UserQueryItem key={index} data={user} /> // Render each user using UserQueryItem component
            ))
        )
    );

    return (
        <BoxStyled className={classes.resultContainer} style={style}>
            <RenderResult />
        </BoxStyled>
    );
};

export default UserResults;
