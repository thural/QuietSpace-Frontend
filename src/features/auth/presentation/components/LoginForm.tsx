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
import React, { PureComponent, ReactNode } from "react";
import { LoadingSpinner } from "@/shared/ui/components";
import { BaseClassComponent, IBaseComponentProps } from "@/shared/components/base/BaseClassComponent";

/**
 * Props for LoginForm component
 */
interface ILoginFormProps extends IBaseComponentProps {
    // No additional props needed
}

/**
 * State for LoginForm component
 */
interface ILoginFormState {
    formData: any;
    isAuthenticating: boolean;
    isError: boolean;
    error: string | null;
    hookData: any;
    hookError: Error | null;
}

/**
 * LoginForm component for user authentication.
 * Uses global auth store for state management.
 * 
 * Converted to class-based component following enterprise patterns with proper state management
 * and lifecycle handling.
 */
class LoginForm extends BaseClassComponent<ILoginFormProps, ILoginFormState> {

    protected override getInitialState(): Partial<ILoginFormState> {
        return {
            formData: { email: '', password: '' },
            isAuthenticating: false,
            isError: false,
            error: null,
            hookData: null,
            hookError: null
        };
    }

    protected override onMount(): void {
        super.onMount();
        this.initializeHookData();
    }

    private initializeHookData(): void {
        try {
            const hookData = useLoginForm();
            this.safeSetState({
                hookData,
                hookError: null
            });
        } catch (error) {
            console.error(error);
            this.safeSetState({
                hookError: error as Error
            });
        }
    }

    private getFormData() {
        const { hookData } = this.state;
        if (!hookData) return {
            formData: { email: '', password: '' },
            isAuthenticating: false,
            isError: false,
            error: null,
            handleLoginForm: () => { },
            handleFormChange: () => { },
            handleSignupBtn: () => { }
        };

        return {
            formData: hookData.formData,
            isAuthenticating: hookData.isAuthenticating,
            isError: hookData.isError,
            error: hookData.error,
            handleLoginForm: hookData.handleLoginForm,
            handleFormChange: hookData.handleFormChange,
            handleSignupBtn: hookData.handleSignupBtn
        };
    }

    protected override renderContent(): ReactNode {
        const { hookError } = this.state;

        if (hookError) {
            const errorMessage = `error on login form: ${hookError.message}`;
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
        } = this.getFormData();

        if (isAuthenticating) return <LoadingSpinner size="md" />;
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
    }
}

export default withErrorBoundary(LoginForm);
