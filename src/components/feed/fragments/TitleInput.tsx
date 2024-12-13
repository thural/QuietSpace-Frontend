import TextInputStyled from "@/components/shared/TextInputStyled";
import useStyles from "@/styles/feed/titleInputStyles";
import { ConsumerFn } from "@/types/genericTypes";

/**
 * Props for the TitleInput component.
 * 
 * @interface TitleInputProps
 * @property {string | undefined} value - The current value of the title input. Defaults to an empty string.
 * @property {ConsumerFn} handleChange - Function to handle changes in the input field.
 */
interface TitleInputProps {
    value: string | undefined;
    handleChange: ConsumerFn;
}

/**
 * TitleInput component.
 * 
 * This component renders a styled input field specifically for entering a title. It allows for a maximum
 * length of 32 characters and a minimum length of 1 character. The input is designed to be clear and user-friendly,
 * with a default placeholder text prompting the user to type a title.
 * 
 * @param {TitleInputProps} props - The component props.
 * @returns {JSX.Element} - The rendered TitleInput component.
 */
const TitleInput: React.FC<TitleInputProps> = ({ value = "", handleChange }) => {
    const classes = useStyles();

    return (
        <TextInputStyled
            className={classes.titleInput}
            name="title"
            minLength="1"
            maxLength="32"
            isStyled={false}
            value={value}
            placeholder="type a title"
            handleChange={handleChange}
        />
    );
}

export default TitleInput;