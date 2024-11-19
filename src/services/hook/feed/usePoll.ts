import { useVotePoll } from "@/services/data/usePostData";
import { parseCount } from "@/utils/stringUtils";
import { ResId } from "@/api/schemas/inferred/common";
import { nullishValidationdError } from "@/utils/errorUtils";
import { Poll, PollOption, VoteBody } from "@/api/schemas/inferred/post";
import { getSignedUser } from "@/api/queries/userQueries";

const usePoll = (pollData: Poll, postId: ResId) => {

    const user = getSignedUser();
    if (user === undefined) throw nullishValidationdError({ user });

    const postVote = useVotePoll(postId);
    const parsedVoteCounts = parseCount(pollData?.voteCount);

    const getStyle = (option: PollOption) => {
        if (pollData.votedOption !== "not voted")
            return option.label === pollData.votedOption ? {} : { filter: "opacity(0.3)" };
        else return {};
    };

    const getShare = (option: PollOption) => {
        if (pollData.votedOption)
            return parseInt(option.voteShare.slice(0, -1));
        else return 0;
    };

    const getText = (option: PollOption) => {
        if (pollData.votedOption)
            return option.voteShare;
        else return "";
    };

    const handleVote = async (e: React.MouseEvent, option: PollOption) => {
        e.stopPropagation();
        const voteBody: VoteBody = {
            userId: user.id,
            postId: postId,
            option: option.label
        };
        postVote.mutate(voteBody);
    };

    return {
        parsedVoteCounts,
        getStyle,
        getShare,
        getText,
        handleVote,
    };
};

export default usePoll;