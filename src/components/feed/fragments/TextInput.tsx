import TextAreaStyled from "@/components/shared/TextAreaStyled";
import useStyles from "@/styles/feed/textInputStyles";
import { ConsumerFn } from "@/types/genericTypes";

export interface TextInputProps {
    name?: string
    value: string
    minHeight?: string,
    handleChange: ConsumerFn
}

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
    )
}

export default TextInput