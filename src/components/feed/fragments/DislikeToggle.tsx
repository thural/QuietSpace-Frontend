import { UserReaction } from "@/api/schemas/inferred/reaction";
import { Reactiontype } from "@/api/schemas/native/reaction";
import { ConsumerFn } from "@/types/genericTypes";
import {
    PiArrowFatDown, PiArrowFatDownFill
} from "react-icons/pi";

interface DisikeToggleProps {
    userReaction: UserReaction
    handleDislike: ConsumerFn
}

const DislikeToggle: React.FC<DisikeToggleProps> = ({ userReaction, handleDislike }) => (
    (!!userReaction && userReaction.reactionType === Reactiontype.DISLIKE)
        ? <PiArrowFatDownFill className="posticon" onClick={handleDislike} />
        : <PiArrowFatDown className="posticon" onClick={handleDislike} />
);

export default DislikeToggle