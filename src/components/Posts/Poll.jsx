import { Progress } from "@mantine/core";
import FlexStyled from "@shared/FlexStyled";
import Typography from "@shared/Typography";
import React from "react";
import usePoll from "./hooks/usePoll";
import styles from "./styles/pollStyles";

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
        return pollData?.options.map((option, index) => (
            <FlexStyled key={index} className={classes.progressContainer} style={getStyle(option)} onClick={() => handleVote(option)}>
                <Typography className={classes.optionDesc}>{option.label}</Typography>
                <Progress className={classes.progress} color="black" size="xl" value={getShare(option)} />
                <Typography className={classes.optionPerc}>{getText(option)}</Typography>
            </FlexStyled>
        ));
    };

    const PollStatus = () => (
        <FlexStyled className={classes.pollStatus}>
            {!pollData?.isEnded && <Typography className="votes">{parsedVoteCounts} votes</Typography>}
            {pollData?.isEnded && <Typography className="votes">poll has ended</Typography>}
        </FlexStyled>
    );

    return (
        <FlexStyled className={classes.pollContainer}>
            <PollOptionList />
            <PollStatus />
        </FlexStyled>
    );
};

export default Poll;