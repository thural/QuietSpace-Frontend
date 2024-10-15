import FlexStyled from "@shared/FlexStyled";
import TextInput from "@shared/TextInput";
import Typography from "@shared/Typography";
import styles from "./styles/createPostStyles";

const PollSection = ({ postData, handleChange, togglePoll, pollView }) => {
    const classes = styles();

    return (
        <FlexStyled
            className={classes.pollView}
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

export default PollSection