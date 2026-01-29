import React from 'react';
import { CommentCardContainer, CommentContent, CommentControls } from "./styles/CommentFormStyles";
import { ResId } from "@/shared/api/models/common";

/**
 * Props for the CommentForm component.
 *
 * @interface CommentFormProps
 * @property {ResId} postId - The ID of the post to which the comment is being made.
 */
interface CommentFormProps {
    postId: ResId;
}

/**
 * CommentForm component that allows users to input and submit comments with emoji support.
 *
 * @param {CommentFormProps} props - The props for the CommentForm component.
 * @returns {JSX.Element} - The rendered comment form component.
 */
const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
    // TODO: Implement comment form logic with proper hooks
    const commentInput = { text: '' };
    const handleEmojiInput = (value: string) => console.log('Input:', value);
    const handleSubmit = () => console.log('Submit comment for post:', postId);
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <CommentCardContainer>
            <CommentContent>
                <input
                    type="text"
                    value={commentInput.text}
                    onChange={(e) => handleEmojiInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="type a comment"
                    ref={inputRef}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />
            </CommentContent>
            <CommentControls>
                <button onClick={handleSubmit}>Submit</button>
            </CommentControls>
        </CommentCardContainer>
    );
};

export default CommentForm;