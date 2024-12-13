import { PostRequest } from "@/api/schemas/inferred/post";
import Clickable from "@/components/shared/Clickable";
import FlexStyled from "@/components/shared/FlexStyled";
import InputBoxStyled from "@/components/shared/InputBoxStyled";
import TextInputStyled from "@/components/shared/TextInputStyled";
import { PollView } from "@/services/hook/feed/useCreatePostForm";
import styles from "@/styles/feed/pollIFormStyles";
import { AnyFunction, ProcedureFn } from "@/types/genericTypes";

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
    postData: PostRequest;
    handleChange: AnyFunction;
    togglePoll: ProcedureFn;
    pollView: PollView;
}

/**
 * PollForm component.
 * 
 * This component renders a form for creating a poll within a post. It includes input fields
 * for multiple poll options and a button to remove the poll. The visibility of the poll form
 * is controlled by the `pollView` prop.
 * 
 * @param {PollFormProps} props - The component props.
 * @returns {JSX.Element} - The rendered PollForm component.
 */
const PollForm: React.FC<PollFormProps> = ({ postData, handleChange, togglePoll, pollView }) => {
    const classes = styles();

    return (
        <FlexStyled
            className={classes.pollForm}
            style={{ display: pollView.enabled ? "flex" : "none" }}
        >
            <InputBoxStyled>
                <TextInputStyled
                    name="option1"
                    className="poll-input"
                    placeholder="yes"
                    handleChange={handleChange}
                />
                <TextInputStyled
                    name="option2"
                    className="poll-input"
                    placeholder="no"
                    handleChange={handleChange}
                />
                <TextInputStyled
                    name="option3"
                    className="poll-input"
                    placeholder="add another option"
                    handleChange={handleChange}
                />
                <TextInputStyled
                    name="option4"
                    className="poll-input"
                    placeholder="add another option"
                    handleChange={handleChange}
                    hidden={!postData.option3}
                />
            </InputBoxStyled>
            <Clickable className="close-poll" onClick={togglePoll}>remove poll</Clickable>
        </FlexStyled>
    );
};

export default PollForm;