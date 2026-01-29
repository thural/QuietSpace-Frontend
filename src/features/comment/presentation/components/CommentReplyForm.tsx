import React from 'react';
import { ResId } from "@/shared/api/models/common";
import { ReplyWrapper, ReplyInputWrapper, ReplyInput, ReplyButton } from "./styles/CommentReplyFormStyles";
import { ConsumerFn } from "@/shared/types/genericTypes";

/**
 * Props for the CommentReplyForm component.
 *
 * @interface CommentReplyFormProps
 * @property {ResId} postId - The ID of the post to which the reply is being made.
 * @property {ResId} parentId - The ID of the parent comment being replied to.
 * @property {ConsumerFn} toggleView - Function to toggle the visibility of the reply form.
 */
interface CommentReplyFormProps {
    postId: ResId;
    parentId: ResId;
    toggleView: ConsumerFn;
}

/**
 * CommentReplyForm component that allows users to input and submit a reply to a comment.
 *
 * This component uses the `useReplyForm` hook to manage the reply input state and submission logic.
 *
 * @param {CommentReplyFormProps} props - The props for the CommentReplyForm component.
 * @returns {JSX.Element} - The rendered reply form component.
 */
const CommentReplyForm: React.FC<CommentReplyFormProps> = ({ postId, parentId, toggleView }) => {
    // TODO: Implement reply form logic with proper hooks
    const user = { id: '1' };
    const commentInput = { text: '' };
    const handleKeyDown = (e: React.KeyboardEvent) => console.log('Key down:', e.key);
    const handleEmojiInput = (value: string) => console.log('Input:', value);
    const handleSubmit = () => console.log('Submit reply for post:', postId, 'parent:', parentId);
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <ReplyWrapper>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ccc' }} />
            <ReplyInputWrapper>
                <ReplyInput
                    value={commentInput.text}
                    onChange={(e) => handleEmojiInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="type a comment"
                    ref={inputRef}
                />
                <ReplyButton onClick={handleSubmit}>Reply</ReplyButton>
            </ReplyInputWrapper>
        </ReplyWrapper>
    );
};

export default CommentReplyForm;