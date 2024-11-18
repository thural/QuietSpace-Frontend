import TextAreaStyled from "@/components/shared/TextAreaStyled";
import { ConsumerFn } from "@/types/genericTypes";
import { createUseStyles } from "react-jss";

interface TextInputProps {
    value: string
    handleChange: ConsumerFn
}

const TextInput: React.FC<TextInputProps> = ({ value, handleChange }) => {


    const useStyles = createUseStyles({

        textarea: {
            width: '100%',
            minHeight: '18vh',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            border: 'none'
        },

        '@media (max-width: 720px)': {
            textarea: {
                height: '100%'
            },
        }
    });


    const classes = useStyles();

    return (
        <TextAreaStyled
            className={classes.textarea}
            name="text"
            value={value}
            handleChange={handleChange}
            placeholder="what's on your mind?"
            maxLength={999}
            minLength={1}
        />
    )
}

export default TextInput