import { ConsumerFn } from "@/types/genericTypes";
import {
    PiChatCircle,
    PiChatCircleFill
} from "react-icons/pi";

interface CommentToggleProps {
    hasCommented: boolean
    toggleForm: ConsumerFn
}

const CommentToggle: React.FC<CommentToggleProps> = ({ hasCommented, toggleForm }) => (
    hasCommented ? <PiChatCircleFill onClick={toggleForm} />
        : <PiChatCircle onClick={toggleForm} />
);

export default CommentToggle