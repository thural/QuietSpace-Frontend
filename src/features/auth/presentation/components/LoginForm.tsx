import ErrorComponent from "@/shared/errors/ErrorComponent";
import InputBoxStyled from "@/shared/InputBoxStyled";
import { Input } from "@/shared/ui/components";
import { useLoginForm } from "@features/auth/application/hooks/useLoginForm";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { FormContainer } from "@auth/presentation/styles/AuthStyles";
import { Container } from "@/shared/ui/components/layout/Container";
import GradientButton from "@/shared/buttons/GradientButton";
import OutlineButton from "@/shared/buttons/OutlineButton";
import FormStyled from "@/shared/FormStyled";
import PassInput from "@/shared/PassInput";
import { Text } from "@/shared/ui/components/typography/Text";
import { Title } from "@/shared/ui/components/typography/Title";
import React from "react";
import LoaderStyled from "@/shared/LoaderStyled";

/**
 * LoginForm component for user authentication.
 * Uses global auth store for state management.
 *
 * @returns {JSX.Element} - The rendered login form component.
 */
const LoginForm: React.FC = () => {

    let data;

    try {
        data = useLoginForm();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error on login form: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const {
        formData,
        isAuthenticating,
        isError,
        error,
        handleLoginForm,
        handleFormChange,
        handleSignupBtn,
    } = data;

    if (isAuthenticating) return <LoaderStyled />;
    if (isError) return <ErrorComponent message={`could not authenticate! error: ${error}`} />;

    return (
        <FormContainer>
            <Title variant="h2">login</Title>
            <FormStyled>
                <Container>
                    <Input
                        placeholder="username or email"
                        name='email'
                        value={formData.email}
                        onChange={handleFormChange}
                    />
                    <PassInput
                        placeholder="password"
                        name='password'
                        value={formData.password}
                        handleChange={handleFormChange}
                    />
                </Container>
            </FormStyled>
            <GradientButton onClick={handleLoginForm} />
            <Text variant="h4">don't have an account?</Text>
            <OutlineButton onClick={handleSignupBtn} name="signup" />
        </FormContainer>
    );
};

export default withErrorBoundary(LoginForm);
