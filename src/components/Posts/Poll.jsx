import React from "react";
import styles from "./styles/pollStyles";
import { Flex, Progress, Text } from "@mantine/core";
import usePoll from "./hooks/usePoll";

const Poll = ({ pollData, postId }) => {
    const classes = styles();
    const {
        parsedVoteCounts,
        getStyle,
        getShare,
        getText,
        handleVote,
    } = usePoll(pollData, postId);

    const PollOptionList = () => {
        return pollData.options.map((option, index) => (
            <Flex key={index} className={classes.progressContainer} style={getStyle(option)} onClick={() => handleVote(option)}>
                <Text className={classes.optionDesc}>{option.label}</Text>
                <Progress className={classes.progress} color="black" size="xl" value={getShare(option)} />
                <Text className={classes.optionPerc}>{getText(option)}</Text>
            </Flex>
        ));
    };

    const PollStatus = () => (
        <Flex className={classes.pollStatus}>
            {!pollData.isEnded && <Text className="votes">{parsedVoteCounts} votes</Text>}
            {pollData.isEnded && <Text className="votes">poll has ended</Text>}
        </Flex>
    );

    return (
        <Flex className={classes.pollContainer}>
            <PollOptionList />
            <PollStatus />
        </Flex>
    );
};

export default Poll;