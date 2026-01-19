import ErrorComponent from "@/shared/errors/ErrorComponent";
import InputBoxStyled from "@/shared/InputBoxStyled";
import TextInputStyled from "@/shared/TextInputStyled";
import { useLoginForm } from "@/services/hook/auth/useLoginForm";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/auth/formStyles";
import BoxStyled from "@/shared/BoxStyled";
import GradientButton from "@/shared/buttons/GradientButton";
import OutlineButton from "@/shared/buttons/OutlineButton";
import FormStyled from "@/shared/FormStyled";
import PassInput from "@/shared/PassInput";
import Typography from "@/shared/Typography";
import React from "react";
import LoaderStyled from "@/shared/LoaderStyled";

/**
 * LoginForm component for user authentication.
 * Uses global auth store for state management.
 *
 * @returns {JSX.Element} - The rendered login form component.
 */
const LoginForm: React.FC = () => {

    const classes = styles();
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
        <BoxStyled className={classes.form}>
            <Typography type="h2">login</Typography>
            <FormStyled>
                <InputBoxStyled>
                    <TextInputStyled
                        placeholder="username or email"
                        name='email'
                        value={formData.email}
                        handleChange={handleFormChange}
                    />
                    <PassInput
                        name='password'
                        value={formData.password}
                        handleChange={handleFormChange}
                    />
                </InputBoxStyled>
            </FormStyled>
            <GradientButton onClick={handleLoginForm} />
            <Typography type="h4">don't have an account?</Typography>
            <OutlineButton name="signup" onClick={handleSignupBtn} />
        </BoxStyled>
    );
};

export default withErrorBoundary(LoginForm);
