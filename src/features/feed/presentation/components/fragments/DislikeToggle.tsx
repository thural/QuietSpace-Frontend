import { ReactionRequest } from "@/features/feed/data/models/reaction";
import { ReactionType } from "@/api/rest/models/native/reaction";
import { ConsumerFn } from "@/shared/types/genericTypes";
import {
    PiArrowFatDown, PiArrowFatDownFill
} from "react-icons/pi";

/**
 * Props for the DislikeToggle component.
 * 
 * @interface DislikeToggleProps
 * @property {ReactionRequest} userReaction - The user's current reaction to the post.
 * @property {ConsumerFn} handleDislike - Function to handle the dislike action.
 */
interface DislikeToggleProps {
    userReaction: ReactionRequest;
    handleDislike: ConsumerFn;
}

/**
 * DislikeToggle component.
 * 
 * This component renders a toggle button for users to express a dislike reaction to a post.
 * It shows a filled dislike icon if the user has already disliked the post, and an outlined
 * icon if they have not. Clicking on the icon triggers the `handleDislike` function.
 * 
 * @param {DislikeToggleProps} props - The component props.
 * @returns {JSX.Element} - The rendered DislikeToggle component.
 */
const DislikeToggle: React.FC<DislikeToggleProps> = ({ userReaction, handleDislike }) => (
    (!!userReaction && userReaction.reactionType === ReactionType.DISLIKE)
        ? <PiArrowFatDownFill className="posticon" onClick={handleDislike} />
        : <PiArrowFatDown className="posticon" onClick={handleDislike} />
);

export default DislikeToggle;