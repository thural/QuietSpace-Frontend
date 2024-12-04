import { GenericWrapperWithRef } from "@/types/sharedComponentTypes";
import { createUseStyles, Theme } from "react-jss";
import FlexStyled from "./FlexStyled";

const ModalStyled: React.FC<GenericWrapperWithRef> = ({ children, ...props }) => {


    const useStyles = createUseStyles((theme: Theme) => ({
        modal: {
            gap: '.5rem',
            top: '50%',
            left: '50%',
            color: theme.colors.text,
            width: '640px',
            maxHeight: '100vh',
            border: `1px solid ${theme.colors.border}`,
            margin: 'auto',
            display: 'flex',
            padding: '1.5rem',
            zIndex: theme.zIndex.modal,
            position: 'fixed',
            flexFlow: 'column nowrap',
            transform: 'translate(-50%, -50%)',
            borderRadius: theme.radius.md,
            background: theme.colors.background
        },
        '@media (max-width: 720px)': {
            modal: {
                gap: '.5rem',
                width: '100%',
                border: 'none',
                height: '100%',
                margin: 'auto',
                display: 'flex',
                padding: '1rem',
                position: 'fixed',
                borderRadius: 'unset',
                flexFlow: 'column nowrap',
                background: theme.colors.background,
            },
        },
    }));

    const classes = useStyles();

    return (
        <FlexStyled className={classes.modal} {...props}>
            {children}
        </FlexStyled>
    )

}

export default ModalStyled