import { createUseStyles } from "react-jss"
import FlexStyled from "./FlexStyled"
import { GenericWrapper } from "../../types/sharedComponentTypes"

const ModalStyled: React.FC<GenericWrapper> = ({ children, ...props }) => {


    const useStyles = createUseStyles({
        modal: {
            gap: '.5rem',
            top: '50%',
            left: '50%',
            color: 'black',
            width: '600px',
            border: '1px solid gray',
            margin: 'auto',
            display: 'flex',
            padding: '1rem',
            zIndex: '3',
            position: 'fixed',
            flexFlow: 'column nowrap',
            transform: 'translate(-50%, -50%)',
            borderRadius: '1em',
            backgroundColor: 'white',
        },
        '@media (max-width: 720px)': {
            modal: {
                gap: '.5rem',
                color: 'black',
                width: '100%',
                border: 'none',
                height: '100%',
                margin: 'auto',
                display: 'flex',
                padding: '1rem',
                zIndex: '3',
                position: 'fixed',
                flexFlow: 'column nowrap',
                borderRadius: 'unset',
                backgroundColor: 'white',
            },
        },
    });

    const classes = useStyles();

    return (
        <FlexStyled className={classes.modal} {...props}>
            {children}
        </FlexStyled>
    )

}

export default ModalStyled