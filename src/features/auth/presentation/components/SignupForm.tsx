import ErrorComponent from "@/shared/errors/ErrorComponent";
import { Input } from "@/shared/ui/components";
import { useSignupForm } from "@features/auth/application/hooks/useSignupForm";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { FormContainer } from "@auth/presentation/styles/AuthStyles";
import { Container } from "@/shared/ui/components";
import GradientButton from "@/shared/ui/buttons/GradientButton";
import OutlineButton from "@/shared/ui/buttons/OutlineButton";
import FormStyled from "@/shared/ui/components/utility/FormStyled";
import FullLoadingOverlay from "@/shared/ui/components/feedback/FullLoadingOverlay";
import PassInput from "@/shared/ui/components/forms/PassInput";
import { Text } from "@/shared/ui/components/typography/Text";
import { Title } from "@/shared/ui/components/typography/Title";
import { ReactNode } from "react";
import { BaseClassComponent, IBaseComponentProps } from "@/shared/components/base/BaseClassComponent";

/**
 * Props for SignupForm component
 */
interface ISignupFormProps extends IBaseComponentProps {
    // No additional props needed
}

/**
 * State for SignupForm component
 */
interface ISignupFormState {
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    formData: any;
    hookData: any;
    hookError: Error | null;
}

/**
 * SignupForm component for user registration.
 * Uses global auth store for state management.
 * 
 * Converted to class-based component following enterprise patterns with proper state management
 * and lifecycle handling.
 */
class SignupForm extends BaseClassComponent<ISignupFormProps, ISignupFormState> {

    protected override getInitialState(): Partial<ISignupFormState> {
        return {
            isLoading: false,
            isError: false,
            error: null,
            formData: {
                username: '',
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
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
            const hookData = useSignupForm();
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
            isLoading: false,
            isError: false,
            error: null,
            formData: {
                username: '',
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            handleSubmit: () => { },
            handleChange: () => { },
            handleLoginClick: () => { }
        };

        return {
            isLoading: hookData.isLoading,
            isError: hookData.isError,
            error: hookData.error,
            formData: hookData.formData,
            handleSubmit: hookData.handleSubmit,
            handleChange: hookData.handleChange,
            handleLoginClick: hookData.handleLoginClick
        };
    }

    protected override renderContent(): ReactNode {
        const { hookError } = this.state;

        if (hookError) {
            const errorMessage = `error on signup form: ${hookError.message}`;
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
        } = this.getFormData();

        if (isLoading) return <FullLoadingOverlay />;
        if (isError) return <ErrorComponent message={`(!) could not authenticate! error: ${error}`} />;

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
    }
}

export default withErrorBoundary(SignupForm);