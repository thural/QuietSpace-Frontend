import ErrorComponent from "@/shared/errors/ErrorComponent";
import InputBoxStyled from "@/shared/InputBoxStyled";
import { Input } from "@/shared/ui/components";
import { useSignupForm } from "@features/auth/application/hooks/useSignupForm";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { FormContainer } from "@auth/presentation/styles/AuthStyles";
import { Container } from "@/shared/ui/components";
import GradientButton from "@/shared/buttons/GradientButton";
import OutlineButton from "@/shared/buttons/OutlineButton";
import FormStyled from "@/shared/FormStyled";
import FullLoadingOverlay from "@/shared/FullLoadingOverlay";
import PassInput from "@/shared/PassInput";
import { Text } from "@/shared/ui/components/typography/Text";
import { Title } from "@/shared/ui/components/typography/Title";
import React from "react";

/**
 * SignupForm component for user registration.
 * Uses global auth store for state management.
 *
 * @returns {JSX.Element} - The rendered signup form component.
 */
const SignupForm: React.FC = () => {

    let data;

    try {
        data = useSignupForm();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error on signup form: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const {
        isLoading,
        isError,
        error,
        formData,
        handleSubmit,
        handleChange,
        handleLoginClick
    } = data;

    if (isLoading) return <FullLoadingOverlay />;
    if (isError) return <ErrorComponent message={`(!) could not authenticate! error: ${error}`} />

    return (
        <FormContainer>
            <Title variant="h2">signup</Title>
            <FormStyled>
                <Container>
                    <Input name='username' value={formData.username} onChange={handleChange} />
                    <Input name='firstname' value={formData.firstname} onChange={handleChange} />
                    <Input name='lastname' value={formData.lastname} onChange={handleChange} />
                    <Input name='email' value={formData.email} onChange={handleChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleChange} />
                    <PassInput name='confirmPassword' value={formData.confirmPassword} handleChange={handleChange} />
                </Container>
            </FormStyled>
            <GradientButton onClick={handleSubmit} />
            <Text variant="h4">already have an account?</Text>
            <OutlineButton onClick={handleLoginClick} name="login" />
        </FormContainer>
    );
};

export default withErrorBoundary(SignupForm);