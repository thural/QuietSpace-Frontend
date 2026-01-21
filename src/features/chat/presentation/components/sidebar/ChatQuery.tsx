import { UserResponse } from "@/features/profile/data/models/user";
import LoaderStyled from "@/shared/LoaderStyled";
import useChatQuery from "@features/chat/application/hooks/useChatQuery";
import styles from "../../styles/chatQueryStyles";
import AnchorStyled from "@shared/AnchorStyled";
import BoxStyled from "@shared/BoxStyled";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import UserCard from "@shared/UserCard";
import React from "react";
import ChatQueryInput from "./ChatQueryInput";


const ChatQuery = () => {
    const classes = styles();

    const {
        queryResult,
        handleChatCreation,
        appliedStyle,
        inputProps,
        makeQueryMutation,
    } = useChatQuery();

    const RecentQueries = React.memo(() => (
        <FlexStyled className={classes.recentQueries} >
            <Typography type="h4" > recent </Typography>
            < AnchorStyled label="clear all" />
        </FlexStyled>
    ));

    const RenderResult = React.memo(() => {
        if (makeQueryMutation.isPending) return <LoaderStyled />;
        if (queryResult.length === 0) return <RecentQueries />;

        return queryResult.map((user: UserResponse, key: number) => (
            <UserCard
                key={key}
                userId={user.id}
                isDisplayEmail={true}
                onClick={(e: React.MouseEvent) => handleChatCreation(e, user)}
            />
        ));
    });

    const QueryPanel = React.memo(() => (
        <FlexStyled
            className={classes.resultContainer}
            style={appliedStyle}
            ref={inputProps.resultListRef}
        >
            <RenderResult />
        </FlexStyled>
    ));

    return (
        <BoxStyled
            onFocus={inputProps.handleInputFocus}
            onBlur={inputProps.handleInputBlur}
            className={classes.searchContainer}
        >
            <ChatQueryInput {...inputProps} />
            <QueryPanel />
        </BoxStyled>
    );
};

export default ChatQuery;