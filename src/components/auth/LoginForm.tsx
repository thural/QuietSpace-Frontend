import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import InputBoxStyled from "@/components/shared/InputBoxStyled";
import TextInputStyled from "@/components/shared/TextInputStyled";
import { useLoginForm } from "@/services/hook/auth/useLoginForm";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/auth/formStyles";
import { AuthFormProps } from "@/types/authTypes";
import BoxStyled from "@components/shared/BoxStyled";
import GradientButton from "@components/shared/buttons/GradientButton";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import FormStyled from "@components/shared/FormStyled";
import PassInput from "@components/shared/PassInput";
import Typography from "@components/shared/Typography";
import React from "react";
import LoaderStyled from "../shared/LoaderStyled";

/**
 * LoginForm component for user authentication.
 *
 * @param {AuthFormProps} props - The props for the LoginForm component.
 * @param {function} props.setAuthState - Function to set the authentication state.
 * @param {object} props.authState - The current authentication state.
 * @returns {JSX.Element} - The rendered login form component.
 */
const LoginForm: React.FC<AuthFormProps> = ({ setAuthState, authState }) => {

    const classes = styles();
    let data;

    try {
        data = useLoginForm({ setAuthState, authState });
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
