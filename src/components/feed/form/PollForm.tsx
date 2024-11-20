import { PostBody } from "@/api/schemas/inferred/post";
import Clickable from "@/components/shared/Clickable";
import FlexStyled from "@/components/shared/FlexStyled";
import InputBoxStyled from "@/components/shared/InputBoxStyled";
import TextInputStyled from "@/components/shared/TextInputStyled";
import { PollView } from "@/services/hook/feed/useCreatePostForm";
import styles from "@/styles/feed/pollIFormStyles";
import { AnyFunction, ProcedureFn } from "@/types/genericTypes";

interface PollForm {
    postData: PostBody
    handleChange: AnyFunction
    togglePoll: ProcedureFn
    pollView: PollView
}

const PollForm: React.FC<PollForm> = ({ postData, handleChange, togglePoll, pollView }) => {

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
            <Clickable className="close-poll" onClick={togglePoll} >remove poll</Clickable>
        </FlexStyled>
    )
}

export default PollForm