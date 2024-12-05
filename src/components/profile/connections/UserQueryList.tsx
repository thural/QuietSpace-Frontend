import { UserList, UserPage } from "@/api/schemas/inferred/user";
import BoxStyled from "@/components/shared/BoxStyled";
import InfinateScrollContainer from "@/components/shared/InfinateScrollContainer";
import LoaderStyled from "@/components/shared/LoaderStyled";
import Typography from "@/components/shared/Typography";
import styles from "@/styles/profile/userListStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import React, { JSXElementConstructor } from "react";

export interface UserListProps extends GenericWrapper {
    userFetch: UseInfiniteQueryResult<InfiniteData<UserPage>>
    queryResult: UserList
    itemProps?: Object
    Item: JSXElementConstructor<any>
}

const UserQueryList: React.FC<UserListProps> = ({ userFetch, queryResult, Item }) => {

    const classes = styles();

    const { isPending, isError, error, isFetchingNextPage, hasNextPage, fetchNextPage } = userFetch;

    const RenderResult = () => (
        isPending ? <LoaderStyled />
            : isError ? <Typography type="h1">{error.message}</Typography>
                : queryResult.map((data, key) => <Item key={key} data={data} />)
    )

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

export default UserQueryList