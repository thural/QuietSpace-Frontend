import DarkButton from "@/components/shared/buttons/DarkButton ";
import FlexStyled from "@/components/shared/FlexStyled";
import useStyles from "@/styles/feed/formControlStyles";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";


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