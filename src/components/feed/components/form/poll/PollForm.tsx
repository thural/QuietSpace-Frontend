import FlexStyled from "@/components/shared/FlexStyled";
import TextInput from "@/components/shared/TextInput";
import Typography from "@/components/shared/Typography";
import styles from "./styles/pollIFormStyles";

const PollForm = ({ postData, handleChange, togglePoll, pollView }) => {
    const classes = styles();

    return (
        <FlexStyled
            className={classes.pollInput}
            style={{ display: pollView.enabled ? "flex" : "none" }}>

            <TextInput
                name="option1"
                className="poll-input"
                placeholder="yes"
                handleChange={handleChange}
            />

            <TextInput
                name="option2"
                className="poll-input"
                placeholder="no"
                handleChange={handleChange}
            />

            <TextInput
                name="option3"
                className="poll-input"
                placeholder="add another option"
                handleChange={handleChange}
            />

            <TextInput
                name="option4"
                className="poll-input"
                placeholder="add another option"
                handleChange={handleChange}
                hidden={!postData.option3}
            />

            <Typography className="close-poll" onClick={togglePoll} >remove poll</Typography>

        </FlexStyled>
    )
}

export default PollForm