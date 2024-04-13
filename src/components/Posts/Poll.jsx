import React from "react";
import styles from "./styles/pollStyles";
import { Flex, Progress, Text } from "@mantine/core";
import { parseCount } from "../../utils/stringUtils";

const Poll = ({ pollData }) => {


    const classes = styles();

    const parsedVoteCounts = parseCount


    return (
        <Flex className={classes.pollContainer}>
            {
                pollData.options.map(option => (
                    <Flex className={classes.progressContainer} style={option.label == pollData.votedOption ? {} : { filter: "opacity(0.3)" }}>
                        <Text className={classes.optionDesc}>{option.label}</Text>
                        <Progress className={classes.progress} color="rgba(0, 0, 0, 1)" size="xl" value={option.voteShare} />
                        <Text className={classes.optionPerc}>{option.voteShare}%</Text>
                    </Flex>
                ))
            }
            <Flex className={classes.pollStatus}>
                {!pollData.isEnded && <Text className="votes">{parseCount(pollData.voteCount)} votes</Text>}
                {pollData.isEnded && <Text className="votes">poll has ended</Text>}
            </Flex>
        </Flex>
    )
}

export default Poll