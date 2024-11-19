import { createUseStyles } from "react-jss";
import BoxStyled from "./BoxStyled"
import { GenericWrapper } from "../../types/sharedComponentTypes";

const InputBoxStyled: React.FC<GenericWrapper> = ({ children }) => {
    const useStyles = createUseStyles({
        inputBox: {
            display: 'flex',
            flexFlow: 'column nowrap',
            gap: '0.5rem',
        },
    });

    const classes = useStyles();

    return (
        < BoxStyled className={classes.inputBox} >
            {children}
        </BoxStyled >
    )
}

export default InputBoxStyled