import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import { CountDownDisplay } from "@/services/hook/common/useTimer";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { ActivationFormProps } from "@/types/authTypes";
import BoxStyled from "@components/shared/BoxStyled";
import GradientButton from "@components/shared/buttons/GradientButton";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import FormStyled from "@components/shared/FormStyled";
import Typography from "@components/shared/Typography";
import { PinInput } from "@mantine/core";
import React from "react";
import { useActivationForm } from "../../services/hook/auth/useActivationForm";
import styles from "../../styles/auth/activationFormStyles";

const Timer = ({ tokenTimer }: { tokenTimer: CountDownDisplay }) => (
    <FormStyled className="timer">
        {!tokenTimer.hasTimeOut ? <Typography>{"code will be expired in:"}</Typography>
            : <Typography>{"code has expired, get a new code"}</Typography>}
        {!tokenTimer.hasTimeOut && tokenTimer.component}
    </FormStyled>
);

const ActivationForm: React.FC<ActivationFormProps> = ({ setAuthState, authState }) => {

    const classes = styles();
    let data = undefined;

    try {
        data = useActivationForm({ setAuthState, authState });
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error on activation form: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const {
        formData,
        tokenTimer,
        handleResendCode,
        handleSubmit,
        handleChange,
    } = data;

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

export default withErrorBoundary(ActivationForm);