import ErrorComponent from "@/shared/errors/ErrorComponent";
import { useActivationForm } from "@features/auth/application/hooks/useActivationForm";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { ActivationContainer } from "@auth/presentation/styles/AuthStyles";
import GradientButton from "@/shared/buttons/GradientButton";
import OutlineButton from "@/shared/buttons/OutlineButton";
import FormStyled from "@/shared/FormStyled";
import { Text } from "@/shared/ui/components/typography/Text";
import { Title } from "@/shared/ui/components/typography/Title";
import { PinInput } from "@/shared/ui/components";
import React from "react";
import CountdownTimer from "@/shared/CountdownTimer";

/**
 * ActivationForm component for user account activation.
 * Uses global auth store for state management.
 *
 * @returns {JSX.Element} - The rendered component.
 */
const ActivationForm: React.FC = () => {

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
        <ActivationContainer>
            <Title variant="h2">Account Activation</Title>
            <Text size="md">{"enter code sent to your email: "}</Text>
            <Text size="md">{formData.email || 'your email'}</Text>
            <FormStyled className='activation-form'>
                <PinInput
                    length={6}
                    type="number"
                    value={formData.activationCode}
                    onChange={handleChange}
                />
                <CountdownTimer period={60000} timeUpMessage="code has expired, get a new code" />
                <GradientButton onClick={handleSubmit} />
            </FormStyled>
            <Text size="md">haven't received a code?</Text>
            <OutlineButton onClick={handleResendCode} name="resend code" />
        </ActivationContainer>
    );
};

export default withErrorBoundary(ActivationForm);