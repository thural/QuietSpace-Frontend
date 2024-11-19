import FlexStyled from "@/components/shared/FlexStyled";
import TextInputStyled from "@/components/shared/TextInputStyled";
import Typography from "@/components/shared/Typography";
import styles from "./styles/pollIFormStyles";
import { PostBody } from "@/api/schemas/inferred/post";
import { AnyFunction, ProcedureFn } from "@/types/genericTypes";
import { PollView } from "../post/hooks/useCreatePostForm";
import InputBoxStyled from "@/components/shared/InputBoxStyled";

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
            <Typography className="close-poll" onClick={togglePoll} >remove poll</Typography>
        </FlexStyled>
    )
}

export default PollForm