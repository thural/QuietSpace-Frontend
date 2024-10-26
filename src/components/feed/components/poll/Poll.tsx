import { Progress } from "@mantine/core";
import FlexStyled from "@/components/shared/FlexStyled";
import Typography from "@/components/shared/Typography";
import styles from "./styles/pollStyles";
import usePoll from "./hooks/usePoll";
import { ResId } from "@/api/schemas/inferred/common";
import { isDateExpired } from "@/utils/dateUtils";
import { Poll } from "@/api/schemas/inferred/post";


interface PollProps {
    pollData: Poll
    postId: ResId
}

const PollBox: React.FC<PollProps> = ({ pollData, postId }) => {

    const classes = styles();

    const {
        parsedVoteCounts,
        getStyle,
        getShare,
        getText,
        handleVote,
    } = usePoll(pollData, postId);

    const isPollDateExpired = pollData.dueDate === null ? true : isDateExpired(pollData.dueDate);

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
            {
                isPollDateExpired ? <Typography className="votes">poll has ended</Typography>
                    : <Typography className="votes">{parsedVoteCounts} votes</Typography>
            }
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