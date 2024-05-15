import React from "react";
import styles from "./styles/pollStyles";
import { Flex, Progress, Text } from "@mantine/core";
import { parseCount } from "../../utils/stringUtils";

const Poll = ({ pollData }) => {

    const parsedVoteCounts = parseCount(pollData.voteCount);

    const getStyle = (option) => {
        if (pollData.votedOption)
            return option.label == pollData.votedOption ? {} : { filter: "opacity(0.3)" };
        else return {}
    }

    const getShare = (option) => {
        if (pollData.votedOption)
            return option.voteShare;
        else return 0;
    }

    const getText = (option) => {
        if (pollData.votedOption)
            return option.voteShare;
        else return "";
    }

    const classes = styles();

    return (
        <Flex className={classes.pollContainer}>
            {
                pollData.options.map((option, index) => (
                    <Flex key={index} className={classes.progressContainer} style={getStyle(option)}>
                        <Text className={classes.optionDesc}>{option.label}</Text>
                        <Progress className={classes.progress} color="black" size="xl" value={getShare(option)} />
                        <Text className={classes.optionPerc}>{getText(option)}</Text>
                    </Flex>
                ))
            }
            <Flex className={classes.pollStatus}>
                {!pollData.isEnded && <Text className="votes">{parsedVoteCounts} votes</Text>}
                {pollData.isEnded && <Text className="votes">poll has ended</Text>}
            </Flex>
        </Flex>
    )
}

export default Poll