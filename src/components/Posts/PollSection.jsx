import { Flex } from "@mantine/core";
import TextInput from "../Shared/TextInput";
import styles from "./styles/createPostStyles";

const PollSection = ({ postData, handleChange, togglePoll, pollView }) => {
    const classes = styles();

    return (
        <Flex
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

            <p className="close-poll" onClick={togglePoll} >remove poll</p>

        </Flex>
    )
}

export default PollSection