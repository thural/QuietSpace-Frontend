import TextInputStyled from "@/components/shared/TextInputStyled";
import useStyles from "@/styles/feed/titleInputStyles";
import { ConsumerFn } from "@/types/genericTypes";

interface TitleInputProps {
    value: string | undefined
    handleChange: ConsumerFn
}

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
    )
}

export default TitleInput