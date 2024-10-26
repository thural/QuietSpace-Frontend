import { useVotePoll } from "@/hooks/data/usePostData";
import { useQueryClient } from "@tanstack/react-query";
import { parseCount } from "@/utils/stringUtils";
import { ResId } from "@/api/schemas/inferred/common";
import { User } from "@/api/schemas/inferred/user";
import { nullishValidationdError } from "@/utils/errorUtils";
import { Poll, PollOption, VoteBody } from "@/api/schemas/inferred/post";

const usePoll = (pollData: Poll, postId: ResId) => {
    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    if (user === undefined) throw nullishValidationdError({ user });
    const postVote = useVotePoll();

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

    const handleVote = async (option: PollOption) => {
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