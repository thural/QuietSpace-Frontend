import { UserList, UserPage } from "@/api/schemas/inferred/user";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import LoaderStyled from "@/components/shared/LoaderStyled";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import BoxStyled from "@components/shared/BoxStyled";
import UserQueryItem from "@components/shared/UserQueryItem";
import { UseMutationResult } from "@tanstack/react-query";
import React, { CSSProperties } from "react";
import styles from "@/styles/search/queryResultStyles";

/**
 * UserQueryProps interface.
 * 
 * This interface defines the props for the UserQuery component.
 * 
 * @property {UseMutationResult<UserPage, Error, string>} fetchUserQuery - The mutation result containing the status of the user fetching operation.
 * @property {UserList} userQueryList - A list of users to be displayed.
 * @property {CSSProperties} [style] - Optional inline styles for the result container.
 */
export interface UserQueryProps extends GenericWrapper {
    fetchUserQuery: UseMutationResult<UserPage, Error, string>;
    userQueryList: UserList;
    style?: CSSProperties;
}

/**
 * UserQuery component.
 * 
 * This component manages the display of a list of users based on the fetching status.
 * It conditionally renders a loading indicator, an error message, or the list of users.
 * 
 * @param {UserQueryProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserQuery component based on the fetching state.
 */
const UserQuery: React.FC<UserQueryProps> = ({ fetchUserQuery, userQueryList, style }) => {
    const classes = styles(); // Apply custom styles

    /**
     * RenderResult function.
     * 
     * This function handles the conditional rendering of the component based on the fetching state.
     * It displays a loader if the fetching is in progress, an error message if there's an error,
     * or the list of users if the fetching is successful.
     * 
     * @returns {JSX.Element} - The rendered result based on the fetching status.
     */
    const RenderResult = () => (
        fetchUserQuery.isPending ? (
            <LoaderStyled /> // Show loader while data is being fetched
        ) : fetchUserQuery.isError ? (
            <ErrorComponent message={fetchUserQuery.error.message} /> // Display error message if fetching fails
        ) : (
            userQueryList.map((user, key) => (
                <UserQueryItem key={key} data={user} /> // Render each user using UserQueryItem component
            ))
        )
    );

    return (
        <BoxStyled className={classes.resultContainer} style={style}>
            <RenderResult /> {/* Render the appropriate result */}
        </BoxStyled>
    );
};

export default UserQuery;