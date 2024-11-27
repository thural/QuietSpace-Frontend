import { ReactionRequest } from "@/api/schemas/inferred/reaction";
import { Reactiontype } from "@/api/schemas/native/reaction";
import { ConsumerFn } from "@/types/genericTypes";
import {
    PiArrowFatUp, PiArrowFatUpFill
} from "react-icons/pi";

interface LikeToggleProps {
    userReaction: ReactionRequest
    handleLike: ConsumerFn
}

const LikeToggle: React.FC<LikeToggleProps> = ({ userReaction, handleLike }) => (
    (!!userReaction && userReaction.reactionType === Reactiontype.LIKE)
        ? <PiArrowFatUpFill className="posticon" onClick={handleLike} />
        : <PiArrowFatUp className="posticon" onClick={handleLike} />
);

export default LikeToggle