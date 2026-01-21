import CommentToggle from "./CommentToggle";
import ShareMenu from "./ShareMenu";
import { ConsumerFn } from "@/shared/types/genericTypes";
import FlexStyled from "@/shared/FlexStyled";

interface InteractionActionsProps {
    hasCommented: boolean;
    toggleCommentForm: ConsumerFn;
    toggleShareForm: ConsumerFn;
    toggleRepostForm: ConsumerFn;
}

const InteractionActions: React.FC<InteractionActionsProps> = ({
    hasCommented,
    toggleCommentForm,
    toggleShareForm,
    toggleRepostForm
}) => (
    <FlexStyled>
        <CommentToggle hasCommented={hasCommented} toggleForm={toggleCommentForm} />
        <ShareMenu handleShareClick={toggleShareForm} handleRepostClick={toggleRepostForm} />
    </FlexStyled>
);

export default InteractionActions;
