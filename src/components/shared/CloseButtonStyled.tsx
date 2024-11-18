import { ConsumerFn } from "@/types/genericTypes"
import BoxStyled from "./BoxStyled"
import { createUseStyles } from "react-jss";

interface CloseButtonProps {
    handleToggle: ConsumerFn
}

const CloseButtonStyled: React.FC<CloseButtonProps> = ({ handleToggle }) => {


    const useStyles = createUseStyles({

        closeButton: {
            display: 'none',
            position: 'fixed',
            top: '.5rem',
            right: '1rem',
            cursor: 'pointer',
            fontSize: '1.5rem'
        },

        '@media (max-width: 720px)': {
            closeButton: {
                display: 'block'
            },
        }
    });

    const classes = useStyles();

    return (
        <BoxStyled onClick={handleToggle} className={classes.closeButton}>x</BoxStyled>
    )
}

export default CloseButtonStyled