import { ReactionRequest } from "@/api/schemas/inferred/reaction";
import { ReactionType } from "@/api/schemas/native/reaction";
import { ConsumerFn } from "@/types/genericTypes";
import {
    PiArrowFatUp, PiArrowFatUpFill
} from "react-icons/pi";

/**
 * Props for the LikeToggle component.
 * 
 * @interface LikeToggleProps
 * @property {ReactionRequest} userReaction - The user's current reaction to the post.
 * @property {ConsumerFn} handleLike - Function to handle the like action.
 */
interface LikeToggleProps {
    userReaction: ReactionRequest;
    handleLike: ConsumerFn;
}

/**
 * LikeToggle component.
 * 
 * This component renders a toggle button for users to express a like reaction to a post.
 * It displays a filled like icon if the user has already liked the post, and an outlined
 * icon if they have not. Clicking on the icon triggers the `handleLike` function.
 * 
 * @param {LikeToggleProps} props - The component props.
 * @returns {JSX.Element} - The rendered LikeToggle component.
 */
const LikeToggle: React.FC<LikeToggleProps> = ({ userReaction, handleLike }) => (
    (!!userReaction && userReaction.reactionType === ReactionType.LIKE)
        ? <PiArrowFatUpFill className="posticon" onClick={handleLike} />
        : <PiArrowFatUp className="posticon" onClick={handleLike} />
);

export default LikeToggle;