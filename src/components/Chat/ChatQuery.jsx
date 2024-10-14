import React from "react";
import AnchorStyled from "../Shared/AnchorStyled";
import BoxStyled from "../Shared/BoxStyled";
import ComponentList from "../Shared/ComponentList";
import FlexStyled from "../Shared/FlexStyled";
import FullLoadingOverlay from "../Shared/FullLoadingOverlay";
import Typography from "../Shared/Typography";
import QueryInput from "./QueryInput";
import UserCard from "./UserCard";
import useQueryContainer from "./hooks/useQueryContainer";
import styles from "./styles/queryContainerStyles";

const ChatQuery = () => {

    const classes = styles();

    const {
        focused,
        queryResult,
        isSubmitting,
        handleItemClick,
        handleInputChange,
        handleKeyDown,
        handleInputFocus,
        handleInputBlur,
        appliedStyle,
        inputProps,
        makeQueryMutation,
    } = useQueryContainer();

    const RecentQueries = () => {
        return (
            <FlexStyled className={classes.recentQueries}>
                <Typography type="h4">recent</Typography>
                <AnchorStyled label="clear all" />
            </FlexStyled>
        )
    }

    const RenderResult = () => {
        if (makeQueryMutation.isPending) return <FullLoadingOverlay />
        if (queryResult.length === 0) return <RecentQueries />
        return <ComponentList list={queryResult} Component={UserCard} handleItemClick={handleItemClick} />;
    }

    const QueryResult = () => {
        return (
            <BoxStyled className={classes.resultContainer} style={appliedStyle}>
                <RenderResult />
            </BoxStyled>
        )
    }


    return (
        <BoxStyled className={classes.searchContainer}>
            <QueryInput {...inputProps} />
            <QueryResult queryResult={queryResult} />
        </BoxStyled>
    )
}

export default ChatQuery;