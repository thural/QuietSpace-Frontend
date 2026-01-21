import { ConsumerFn } from "@/shared/types/genericTypes";
import {
    PiChatCircle,
    PiChatCircleFill
} from "react-icons/pi";

/**
 * Props for the CommentToggle component.
 * 
 * @interface CommentToggleProps
 * @property {boolean} hasCommented - Indicates whether the user has commented on the post.
 * @property {ConsumerFn} toggleForm - Function to toggle the comment form visibility.
 */
interface CommentToggleProps {
    hasCommented: boolean;
    toggleForm: ConsumerFn;
}

/**
 * CommentToggle component.
 * 
 * This component renders an icon that allows users to toggle the visibility of
 * a comment form. The icon displayed changes based on whether the user has
 * previously commented on the post. A filled icon indicates that the user has
 * commented, while an outlined icon indicates they have not.
 * 
 * @param {CommentToggleProps} props - The component props.
 * @returns {JSX.Element} - The rendered CommentToggle component.
 */
const CommentToggle: React.FC<CommentToggleProps> = ({ hasCommented, toggleForm }) => (
    hasCommented ? <PiChatCircleFill onClick={toggleForm} />
        : <PiChatCircle onClick={toggleForm} />
);

export default CommentToggle;