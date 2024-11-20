import TextAreaStyled from "@/components/shared/TextAreaStyled";
import { ConsumerFn } from "@/types/genericTypes";
import { createUseStyles } from "react-jss";

interface TextInputProps {
    value: string
    minHeight?: string,
    handleChange: ConsumerFn
}

const TextInput: React.FC<TextInputProps> = ({ value, handleChange, minHeight = "18vh" }) => {


    const useStyles = createUseStyles({

        textarea: {
            width: '100%',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            border: 'none',
            minHeight,
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