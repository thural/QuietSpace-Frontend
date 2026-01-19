import TextAreaStyled from "@/shared/TextAreaStyled";
import useStyles from "../styles/textInputStyles";
import { ConsumerFn } from "@/types/genericTypes";

/**
 * Props for the TextInput component.
 * 
 * @interface TextInputProps
 * @property {string} [name] - The name of the input field, defaults to "text".
 * @property {string} value - The current value of the input field.
 * @property {string} [minHeight] - Minimum height of the text area.
 * @property {ConsumerFn} handleChange - Function to handle changes in the input field.
 */
export interface TextInputProps {
    name?: string;
    value: string;
    minHeight?: string;
    handleChange: ConsumerFn;
}

/**
 * TextInput component.
 * 
 * This component renders a styled text area for user input. It accepts a value and a change handler,
 * allowing for real-time updates as the user types. The text area has a maximum length of 999 characters
 * and a minimum length of 1 character, with a default placeholder text.
 * 
 * @param {TextInputProps} props - The component props.
 * @returns {JSX.Element} - The rendered TextInput component.
 */
const TextInput: React.FC<TextInputProps> = (props) => {
    const { name = "text", value, handleChange } = props;
    const classes = useStyles(props);

    return (
        <TextAreaStyled
            className={classes.textarea}
            name={name}
            value={value}
            handleChange={handleChange}
            placeholder="what's on your mind?"
            maxLength={999}
            minLength={1}
        />
    );
}

export default TextInput;