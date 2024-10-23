import { useVotePoll } from "@/hooks/data/usePostData";
import { useQueryClient } from "@tanstack/react-query";
import { parseCount } from "@/utils/stringUtils";
import { PollOptionSchema, PollSchema, VoteBody } from "@/api/schemas/post";
import { ResId } from "@/api/schemas/common";
import { UserSchema } from "@/api/schemas/user";
import { produceUndefinedError } from "@/utils/errorUtils";

const usePoll = (pollData: PollSchema, postId: ResId) => {
    const queryClient = useQueryClient();
    const user: UserSchema | undefined = queryClient.getQueryData(["user"]);
    if (user === undefined) throw produceUndefinedError({ user });
    const postVote = useVotePoll();

    const parsedVoteCounts = parseCount(pollData?.voteCount);

    const getStyle = (option: PollOptionSchema) => {
        if (pollData.votedOption !== "not voted")
            return option.label === pollData.votedOption ? {} : { filter: "opacity(0.3)" };
        else return {};
    };

    const getShare = (option: PollOptionSchema) => {
        if (pollData.votedOption)
            return parseInt(option.voteShare.slice(0, -1));
        else return 0;
    };

    const getText = (option: PollOptionSchema) => {
        if (pollData.votedOption)
            return option.voteShare;
        else return "";
    };

    const handleVote = async (option: PollOptionSchema) => {
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