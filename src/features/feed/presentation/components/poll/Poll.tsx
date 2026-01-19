import { ResId } from "@/api/schemas/inferred/common";
import { PollResponse } from "@/api/schemas/inferred/post";
import Conditional from "@/shared/Conditional";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import FlexStyled from "@/shared/FlexStyled";
import Typography from "@/shared/Typography";
import usePoll from "@/services/hook/feed/usePoll";
import styles from "../../styles/pollStyles";
import { isDateExpired } from "@/utils/dateUtils";
import { Progress } from "@mantine/core";
import React from "react";

/**
 * Props for the PollBox component.
 * 
 * @interface PollProps
 * @property {PollResponse | null} pollData - The poll data object containing options and metadata, or null if not available.
 * @property {ResId} postId - The ID of the post associated with the poll.
 */
interface PollProps {
    pollData: PollResponse | null;
    postId: ResId;
}

/**
 * PollBox component.
 * 
 * This component renders a poll with its options and status. It handles the voting logic
 * and displays the current vote counts, as well as whether the poll has expired. If
 * the poll data cannot be retrieved, it shows an error message.
 * 
 * @param {PollProps} props - The component props.
 * @returns {JSX.Element} - The rendered PollBox component.
 */
const PollBox: React.FC<PollProps> = ({ pollData, postId }) => {

    const classes = styles();

    let data = undefined;

    try {
        if (!pollData) throw new Error("pollData is undefined");
        data = usePoll(pollData, postId);
    } catch (error: unknown) {
        return <ErrorComponent message={(error as Error).message} />;
    }

    const {
        parsedVoteCounts,
        getStyle,
        getShare,
        getText,
        handleVote,
    } = data;

    const isPollDateExpired = pollData.dueDate === null ? true : isDateExpired(pollData.dueDate);

    /**
     * Renders a list of poll options.
     * 
     * Each option is clickable and triggers the voting function when clicked. Displays
     * the option label, a progress bar representing the vote share, and the percentage
     * of votes for that option.
     * 
     * @returns {JSX.Element[]} - An array of JSX elements representing each poll option.
     */
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

    /**
     * Renders the poll status based on whether the poll is expired or still active.
     * 
     * Displays a message indicating the number of votes or that the poll has ended.
     * 
     * @returns {JSX.Element} - The rendered poll status component.
     */
    const PollStatus = () => (
        <FlexStyled className={classes.pollStatus}>
            <Conditional isEnabled={isPollDateExpired}>
                <Typography className="votes">poll has ended</Typography>
            </Conditional>
            <Conditional isEnabled={!isPollDateExpired}>
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