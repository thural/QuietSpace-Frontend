import DarkButton from "@/components/shared/buttons/DarkButton ";
import FlexStyled from "@/components/shared/FlexStyled";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import { createUseStyles } from "react-jss";


export const useStyles = createUseStyles({

    button: {
        display: 'block',
        padding: '0 1rem',
        fontSize: '1rem',
        fontWeight: '500',
        marginLeft: 'auto',
        borderRadius: '3rem',
    },

    controlArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        '& svg': {
            fontSize: '1.5rem'
        },
    },

    '@media (max-width: 720px)': {
        controlArea: {
            display: 'flex',
            gap: '1.25rem',
            alignItems: 'center',
            marginTop: 'auto'
        },
    }

});

export interface FormControlsProps extends GenericWrapper {
    isLoading: boolean,
    isDisabled: boolean,
    handleSubmit: ConsumerFn
}

const FormControls: React.FC<FormControlsProps> = ({ isLoading, isDisabled, handleSubmit, children }) => {

    const classes = useStyles();

    return (
        <FlexStyled className={classes.controlArea}>
            {children}
            <DarkButton className={classes.button} name="post" disabled={isDisabled} loading={isLoading} onClick={handleSubmit} />
        </FlexStyled>
    )
};

export default FormControls