import React from "react";
import AnchorStyled from "../Shared/AnchorStyled";
import BoxStyled from "../Shared/BoxStyled";
import FlexStyled from "../Shared/FlexStyled";
import FullLoadingOverlay from "../Shared/FullLoadingOverlay";
import Typography from "../Shared/Typography";
import QueryInput from "./QueryInput";
import QueryItem from "./QueryItem";
import useQueryContainer from "./hooks/useQueryContainer";
import styles from "./styles/queryContainerStyles";

const QueryContainer = () => {

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

    const ResultList = ({ queryResult }) => {
        return queryResult.map((user, index) => (
            <QueryItem key={index} user={user} handleItemClick={handleItemClick} />
        ))
    }

    const RenderResult = () => {
        if (makeQueryMutation.isPending) return <FullLoadingOverlay />
        else if (queryResult.length === 0) return <RecentQueries />
        else return <ResultList queryResult={queryResult} />;
    }

    const ResultContainer = () => {
        return (
            <BoxStyled className={classes.resultContainer} style={appliedStyle}>
                <RenderResult />
            </BoxStyled>
        )
    }


    return (
        <BoxStyled className={classes.searchContainer}>
            <QueryInput {...inputProps} />
            <ResultContainer queryResult={queryResult} />
        </BoxStyled>
    )
}

export default QueryContainer;