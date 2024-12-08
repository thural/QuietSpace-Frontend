import { ResId } from "@/api/schemas/inferred/common";
import { PollResponse } from "@/api/schemas/inferred/post";
import Conditional from "@/components/shared/Conditional";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import usePoll from "@/services/hook/feed/usePoll";
import styles from "@/styles/feed/pollStyles";
import { isDateExpired } from "@/utils/dateUtils";
import { Progress } from "@mantine/core";
import React from "react";


interface PollProps {
    pollData: PollResponse | null
    postId: ResId
}

const PollBox: React.FC<PollProps> = ({ pollData, postId }) => {

    const classes = styles();

    let data = undefined;

    try {
        if (!pollData) throw new Error("pollData is undefined");
        data = usePoll(pollData, postId);
    } catch (error: unknown) {
        return <ErrorComponent message={(error as Error).message} />
    }

    const {
        parsedVoteCounts,
        getStyle,
        getShare,
        getText,
        handleVote,
    } = data;

    const isPollDateExpired = pollData.dueDate === null ? true : isDateExpired(pollData.dueDate);


    const PollOptionList = () => {
        return pollData?.options.map((option, index) => (
            <FlexStyled
                key={index}
                className={classes.progressContainer}
                style={getStyle(option)}
                onClick={(e: React.MouseEvent) => handleVote(e, option)}
            >
                <Typography className={classes.optionDesc}>{option.label}</Typography>
                <Progress className={classes.progress} color="black" size="xl" value={getShare(option)} />
                <Typography className={classes.optionPerc}>{getText(option)}</Typography>
            </FlexStyled>
        ));
    };


    const PollStatus = () => (
        <FlexStyled className={classes.pollStatus}>
            <Conditional isEnabled={isPollDateExpired} >
                <Typography className="votes">poll has ended</Typography>
            </Conditional>
            <Conditional isEnabled={!isPollDateExpired} >
                <Typography className="votes">{parsedVoteCounts} votes</Typography>
            </Conditional>
        </FlexStyled>
    );


    return (
        <FlexStyled className={classes.pollContainer}>
            <PollOptionList />
            <PollStatus />
        </FlexStyled>
    );
};

export default PollBox;