import { ReactionRequest } from "@/api/schemas/inferred/reaction";
import FlexStyled from "@/shared/FlexStyled";
import LikeToggle from "./LikeToggle";
import DislikeToggle from "./DislikeToggle";
import { ConsumerFn } from "@/types/genericTypes";

interface ReactionGroupProps {
    userReaction: ReactionRequest;
    handleLike: ConsumerFn;
    handleDislike: ConsumerFn;
}

const ReactionGroup: React.FC<ReactionGroupProps> = ({ userReaction, handleLike, handleDislike }) => (
    <FlexStyled>
        <LikeToggle userReaction={userReaction} handleLike={handleLike} />
        <DislikeToggle userReaction={userReaction} handleDislike={handleDislike} />
    </FlexStyled>
);

export default ReactionGroup;
