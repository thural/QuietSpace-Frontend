import { UserList, UserPage } from "@/features/profile/data/models/user";
import BoxStyled from "@/shared/BoxStyled";
import InfinateScrollContainer from "@/shared/InfinateScrollContainer";
import LoaderStyled from "@/shared/LoaderStyled";
import Typography from "@/shared/Typography";
import styles from "../styles/userListStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import React, { JSXElementConstructor } from "react";

/**
 * UserListProps interface.
 * 
 * This interface defines the props for the UserQueryList component.
 * 
 * @property {UseInfiniteQueryResult<InfiniteData<UserPage>>} userFetch - The user data fetched using infinite scrolling.
 * @property {UserList} queryResult - The list of users to be rendered.
 * @property {Object} [itemProps] - Optional additional props to pass to the item component.
 * @property {JSXElementConstructor<any>} Item - The component used to render each user item.
 */
export interface UserListProps extends GenericWrapper {
    userFetch: any;
    queryResult: UserList;
    itemProps?: Object;
    Item: JSXElementConstructor<any>;
}

/**
 * UserQueryList component.
 * 
 * This component displays a list of user items with infinite scrolling support.
 * It handles loading and error states, rendering a loader or error message as necessary.
 * It utilizes the provided Item component to render each user in the list.
 * 
 * @param {UserListProps} props - The component props.
 * @returns {JSX.Element} - The rendered UserQueryList component.
 */
const UserQueryList: React.FC<UserListProps> = ({ userFetch, queryResult, Item }) => {
    const classes = styles();

    const { isPending, isError, error, isFetchingNextPage, hasNextPage, fetchNextPage } = userFetch;

    /**
     * Renders the result based on the current loading and error state.
     * 
     * @returns {JSX.Element} - The rendered result (loader, error message, or user list).
     */
    const RenderResult = () => (
        isPending ? <LoaderStyled />
            : isError ? <Typography type="h1">{error.message}</Typography>
                : queryResult.map((data, key) => <Item key={key} data={data} />)
    );

    return (
        <BoxStyled className={classes.resultContainer}>
            <InfinateScrollContainer
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
            >
                <RenderResult />
            </InfinateScrollContainer>
        </BoxStyled>
    );
}

export default UserQueryList;