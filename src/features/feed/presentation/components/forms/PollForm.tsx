import { PostRequest } from "@/features/feed/data/models/post";
import Clickable from "@/shared/Clickable";
import { Container, Input } from "@shared/ui/components";
import { PollForm as PollFormStyled, PollFormBody, PollOptionInput, AddOptionButton } from "../../styles/pollIFormStyles";
import { PollView } from "@features/feed/application/hooks/useCreatePostForm";
import { AnyFunction, ProcedureFn } from "@/shared/types/genericTypes";

/**
 * Props for the PollForm component.
 * 
 * @interface PollFormProps
 * @property {PostRequest} postData - The data object representing the post.
 * @property {AnyFunction} handleChange - Function to handle input changes.
 * @property {ProcedureFn} togglePoll - Function to toggle the visibility of the poll.
 * @property {PollView} pollView - Object that controls the visibility of the poll options.
 */
interface PollFormProps {
    postData: any;
    handleChange: AnyFunction;
    togglePoll: ProcedureFn;
    pollView: PollView;
}

/**
 * PollForm component.
 * 
 * This component renders a form for creating a poll with multiple options. It allows users to add
 * up to four options and provides a button to remove the poll entirely. The form is conditionally
 * rendered based on the poll view state.
 * 
 * @param {PollFormProps} props - The component props.
 * @returns {JSX.Element} - The rendered PollForm component.
 */
const PollForm: React.FC<PollFormProps> = ({ postData, handleChange, togglePoll, pollView }) => {
    return (
        <PollFormStyled isVisible={pollView.enabled}>
            <PollFormBody>
                <PollOptionInput
                    name="option1"
                    placeholder="yes"
                    value={postData?.option1 ?? ""}
                    onChange={handleChange}
                />
                <PollOptionInput
                    name="option2"
                    placeholder="no"
                    value={postData?.option2 ?? ""}
                    onChange={handleChange}
                />
                <PollOptionInput
                    name="option3"
                    placeholder="add another option"
                    value={postData?.option3 ?? ""}
                    onChange={handleChange}
                />
                <PollOptionInput
                    name="option4"
                    placeholder="add another option"
                    value={postData?.option4 ?? ""}
                    onChange={handleChange}
                    hasError={!postData?.option3}
                />
            </PollFormBody>
            <Clickable className="close-poll" onClick={togglePoll}>remove poll</Clickable>
        </PollFormStyled>
    );
};

export default PollForm;