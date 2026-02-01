import ErrorComponent from "@/shared/errors/ErrorComponent";
import { useActivationForm } from "@features/auth/application/hooks/useActivationForm";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { ActivationContainer } from "@auth/presentation/styles/AuthStyles";
import GradientButton from "@/shared/ui/buttons/GradientButton";
import OutlineButton from "@/shared/ui/buttons/OutlineButton";
import FormStyled from "@/shared/ui/components/utility/FormStyled";
import { Text } from "@/shared/ui/components/typography/Text";
import { Title } from "@/shared/ui/components/typography/Title";
import { PinInput } from "@/shared/ui/components";
import { ReactNode } from "react";
import CountdownTimer from "@/shared/ui/components/utility/CountdownTimer";
import { BaseClassComponent, IBaseComponentProps } from "@/shared/components/base/BaseClassComponent";

/**
 * Props for ActivationForm component
 */
interface IActivationFormProps extends IBaseComponentProps {
    // No additional props needed
}

/**
 * State for ActivationForm component
 */
interface IActivationFormState {
    formData: any;
    hookData: any;
    hookError: Error | null;
}

/**
 * ActivationForm component for user account activation.
 * Uses global auth store for state management.
 * 
 * Converted to class-based component following enterprise patterns with proper state management
 * and lifecycle handling.
 */
class ActivationForm extends BaseClassComponent<IActivationFormProps, IActivationFormState> {

    protected override getInitialState(): Partial<IActivationFormState> {
        return {
            formData: {
                email: '',
                activationCode: ''
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
            const hookData = useActivationForm();
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
            formData: {
                email: '',
                activationCode: ''
            },
            handleResendCode: () => { },
            handleSubmit: () => { },
            handleChange: () => { }
        };

        return {
            formData: hookData.formData,
            handleResendCode: hookData.handleResendCode,
            handleSubmit: hookData.handleSubmit,
            handleChange: hookData.handleChange
        };
    }

    protected override renderContent(): ReactNode {
        const { hookError } = this.state;

        if (hookError) {
            const errorMessage = `error on activation form: ${hookError.message}`;
            return <ErrorComponent message={errorMessage} />;
        }

        const {
            formData,
            handleResendCode,
            handleSubmit,
            handleChange,
        } = this.getFormData();

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
    }
}

export default withErrorBoundary(ActivationForm);