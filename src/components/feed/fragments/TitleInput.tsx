import TextInputStyled from "@/components/shared/TextInputStyled"
import { ConsumerFn } from "@/types/genericTypes";
import { createUseStyles } from "react-jss";

interface TitleInputProps {
    value: string
    handleChange: ConsumerFn
}

const TitleInput: React.FC<TitleInputProps> = ({ value, handleChange }) => {


    const useStyles = createUseStyles({

        titleInput: {
            width: '100%',
            fontWeight: '600',
            border: 'none',
            height: '1.8rem',
            boxSizing: 'border-box',
            marginBottom: '0.5rem',

            '&:focus': {
                outline: 'none',
                borderColor: '#a7abb1',
            },
        },
    });


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
    )
}

export default TitleInput