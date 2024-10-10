import { useQueryClient } from "@tanstack/react-query";
import { useVotePoll } from "../../../hooks/usePostData";
import { parseCount } from "../../../utils/stringUtils";

const usePoll = (pollData, postId) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const postVote = useVotePoll();

    const parsedVoteCounts = parseCount(pollData.voteCount);

    const getStyle = (option) => {
        if (pollData.votedOption !== "not voted")
            return option.label === pollData.votedOption ? {} : { filter: "opacity(0.3)" };
        else return {};
    };

    const getShare = (option) => {
        if (pollData.votedOption)
            return parseInt(option.voteShare.slice(0, -1));
        else return 0;
    };

    const getText = (option) => {
        if (pollData.votedOption)
            return option.voteShare;
        else return "";
    };

    const handleVote = async (option) => {
        const voteBody = {
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