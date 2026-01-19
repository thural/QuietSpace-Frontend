import ErrorComponent from "@/shared/errors/ErrorComponent";
import { useActivationForm } from "@/services/hook/auth/useActivationForm";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/auth/activationFormStyles";
import BoxStyled from "@/shared/BoxStyled";
import GradientButton from "@/shared/buttons/GradientButton";
import OutlineButton from "@/shared/buttons/OutlineButton";
import FormStyled from "@/shared/FormStyled";
import Typography from "@/shared/Typography";
import { PinInput } from "@mantine/core";
import React from "react";
import CountdownTimer from "@/shared/CountdownTimer";

/**
 * ActivationForm component for user account activation.
 * Uses global auth store for state management.
 *
 * @returns {JSX.Element} - The rendered component.
 */
const ActivationForm: React.FC = () => {

    const classes = styles();
    let data;

    try {
        data = useActivationForm();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error on activation form: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const {
        formData,
        handleResendCode,
        handleSubmit,
        handleChange,
    } = data;

    return (
        <BoxStyled className={classes.activation}>
            <Typography type="h2">Account Activation</Typography>
            <Typography size="md">{"enter code sent to your email: "}</Typography>
            <Typography size="md">{formData.email || 'your email'}</Typography>
            <FormStyled className='activation-form'>
                <PinInput
                    length={6}
                    name="activationCode"
                    type="number"
                    value={formData.activationCode}
                    onChange={handleChange}
                />
                <CountdownTimer period={60000} timeUpMessage="code has expired, get a new code" />
                <GradientButton onClick={handleSubmit} />
            </FormStyled>
            <Typography size="md">haven't received a code?</Typography>
            <OutlineButton onClick={handleResendCode} name="resend code" />
        </BoxStyled>
    );
};

export default withErrorBoundary(ActivationForm);