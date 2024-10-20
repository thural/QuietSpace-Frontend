import { PinInput } from "@mantine/core";
import BoxStyled from "@components/shared/BoxStyled";
import GradientButton from "@components/shared/buttons/GradientButton";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import FormStyled from "@components/shared/FormStyled";
import Typography from "@components/shared/Typography";
import { useActivationForm } from "./hooks/useActivationForm";
import styles from "./styles/activationFormStyles";
import { ActivationFormProps } from "@components/shared/types/authTypes";

const Timer = ({ tokenTimer }) => (
    <FormStyled className="timer">
        {!tokenTimer.hasTimeOut ? <Typography>{"code will be expired in:"}</Typography>
            : <Typography>{"code has expired, get a new code"}</Typography>}
        {!tokenTimer.hasTimeOut && tokenTimer.component}
    </FormStyled>
);

const ActivationForm: React.FC<ActivationFormProps> = ({ setAuthState, authState }) => {

    const classes = styles();

    const {
        formData,
        tokenTimer,
        handleResendCode,
        handleSubmit,
        handleChange,
    } = useActivationForm({ setAuthState, authState });

    return (
        <BoxStyled className={classes.activation}>
            <Typography type="h2">Account Activation</Typography>
            <Typography size="md">{"enter code sent to your email: "}</Typography>
            <Typography size="md">{authState.formData.email}</Typography>
            <FormStyled className='activation-form'>
                <PinInput
                    length={6}
                    name="activationCode"
                    type="number"
                    value={formData.activationCode}
                    onChange={handleChange}
                />
                <Timer tokenTimer={tokenTimer} />
                <GradientButton onClick={handleSubmit} />
            </FormStyled>
            <Typography size="md">haven't received a code?</Typography>
            <OutlineButton onClick={handleResendCode} name="resend code" />
        </BoxStyled>
    );
};

export default ActivationForm;