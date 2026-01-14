import ErrorComponent from "@/shared/errors/ErrorComponent";
import { useActivationForm } from "@/services/hook/auth/useActivationForm";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/auth/activationFormStyles";
import { ActivationFormProps } from "@/types/authTypes";
import BoxStyled from "@components/shared/BoxStyled";
import GradientButton from "@components/shared/buttons/GradientButton";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import FormStyled from "@components/shared/FormStyled";
import Typography from "@components/shared/Typography";
import { PinInput } from "@mantine/core";
import React from "react";
import CountdownTimer from "../shared/CountdownTimer";

/**
 * ActivationForm component for user account activation.
 *
 * @param {ActivationFormProps} props - The props for the ActivationForm component.
 * @param {function} props.setAuthState - Function to set the authentication state.
 * @param {object} props.authState - The current authentication state.
 * @returns {JSX.Element} - The rendered component.
 */
const ActivationForm: React.FC<ActivationFormProps> = ({ setAuthState, authState }) => {

    const classes = styles();
    let data;

    try {
        data = useActivationForm({ setAuthState, authState });
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
            <Typography size="md">{authState.formData.email}</Typography>
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