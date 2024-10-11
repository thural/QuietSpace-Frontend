import { Anchor, Box, Flex, Title } from "@mantine/core";
import React from "react";
import FullLoadingOverlay from "../Shared/FillLoadingOverlay";
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
            <Flex className={classes.recentQueries}>
                <Title order={4}>recent</Title>
                <Anchor fw={400} fz="1rem" href="" target="_blank" underline="never">clear all</Anchor>
            </Flex>
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

    const ResultContainer = ({ queryResult }) => {
        return (
            <Box className={classes.resultContainer} style={appliedStyle}>
                <RenderResult />
            </Box>
        )
    }


    return (
        <Box className={classes.searchContainer}>
            <QueryInput {...inputProps} />
            <ResultContainer queryResult={queryResult} />
        </Box>
    )
}

export default QueryContainer;