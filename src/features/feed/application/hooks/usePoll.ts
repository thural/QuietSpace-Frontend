import useUserQueries from "@profile/data/userQueries";
import { ResId } from "@/shared/api/models/common";
import { PollResponse, PollOption, VoteBody } from "@/features/feed/data/models/post";
import { useVotePoll } from "@features/feed/data";
import { parseCount } from "@/shared/utils/stringUtils";

/**
 * Custom hook for managing the state and logic of a poll.
 *
 * This hook retrieves the signed-in user, handles voting on a poll,
 * and provides utility functions to style poll options and display vote shares.
 *
 * @param {PollResponse} pollData - The data of the poll including options and vote counts.
 * @param {ResId} postId - The ID of the post associated with the poll.
 * @returns {{
 *     parsedVoteCounts: number,                      // The parsed vote count for the poll.
 *     getStyle: (option: PollOption) => object,     // Function to get the style for a poll option based on the user's vote.
 *     getShare: (option: PollOption) => number,     // Function to get the share of votes for a specific option.
 *     getText: (option: PollOption) => string,      // Function to get the vote share text for a specific option.
 *     handleVote: (e: React.MouseEvent, option: PollOption) => Promise<void> // Function to handle voting on a poll option.
 * }} - An object containing the poll state and utility functions for managing the poll.
 */
const usePoll = (pollData: PollResponse, postId: ResId) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();

    const postVote = useVotePoll(postId);
    const parsedVoteCounts = parseCount(pollData?.voteCount);

    /**
     * Gets the style for a poll option based on whether the user has voted.
     *
     * @param {PollOption} option - The poll option to style.
     * @returns {object} - The style object for the option.
     */
    const getStyle = (option: PollOption) => {
        if (pollData.votedOption !== "not voted") {
            return option.label === pollData.votedOption ? {} : { filter: "opacity(0.3)" };
        } else return {};
    };

    /**
     * Gets the share of votes for a specific poll option.
     *
     * @param {PollOption} option - The poll option to calculate the share for.
     * @returns {number} - The share of votes for the option.
     */
    const getShare = (option: PollOption) => {
        if (pollData.votedOption) {
            return parseInt(option.voteShare.slice(0, -1));
        } else return 0;
    };

    /**
     * Gets the vote share text for a specific poll option.
     *
     * @param {PollOption} option - The poll option to retrieve the text for.
     * @returns {string} - The vote share text for the option.
     */
    const getText = (option: PollOption) => {
        if (pollData.votedOption) {
            return option.voteShare;
        } else return "";
    };

    /**
     * Handles the voting action on a poll option.
     *
     * @param {React.MouseEvent} e - The mouse event triggered by the vote action.
     * @param {PollOption} option - The poll option that the user is voting for.
     * @returns {Promise<void>} - A promise that resolves when the vote action is completed.
     */
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