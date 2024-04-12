import React from "react";
import styles from "./styles/pollStyles";
import { Flex, Progress, Text } from "@mantine/core";

const Poll = ({pollData}) => {


    const classes = styles();


    return (
        <Flex className={classes.pollContainer}>
            {
                pollData.options.map(option => (
                    <Flex className={classes.progressContainer}>
                        <Text className={classes.optionDesc}>{option.label}</Text>
                        <Progress className={classes.progress} color="rgba(0, 0, 0, 1)" size="xl" value={option.voteShare} />
                        <Text className={classes.optionPerc}>{option.voteShare}%</Text>
                    </Flex>
                ))
            }
        </Flex>
    )
}

export default Poll