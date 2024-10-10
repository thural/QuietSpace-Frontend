import React from "react";
import { Box, Flex, LoadingOverlay, Title, Anchor } from "@mantine/core";
import styles from "./styles/queryContainerStyles";
import QueryItem from "./QueryItem";
import QueryInput from "./QueryInput";
import useQueryContainer from "./hooks/useQueryContainer";

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

    return (
        <Box className={classes.searchContainer}>
            <QueryInput {...inputProps} />
            <Box className={classes.resultContainer} style={appliedStyle}>
                {makeQueryMutation.isPending ? (
                    <LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2 }} />
                ) : queryResult.length === 0 ? (
                    <Flex className={classes.recentQueries}>
                        <Title order={4}>recent</Title>
                        <Anchor fw={400} fz="1rem" href="" target="_blank" underline="never">clear all</Anchor>
                    </Flex>
                ) : (
                    queryResult.map((user, index) => (
                        <QueryItem key={index} user={user} handleItemClick={handleItemClick} />
                    ))
                )}
            </Box>
        </Box>
    );
};

export default QueryContainer;