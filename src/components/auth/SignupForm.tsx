import ErrorComponent from "@/shared/errors/ErrorComponent";
import InputBoxStyled from "@/shared/InputBoxStyled";
import TextInputStyled from "@/shared/TextInputStyled";
import { useSignupForm } from "@/services/hook/auth/useSignupForm";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/auth/formStyles";
import { SignupFormProps } from "@/types/authTypes";
import BoxStyled from "@/shared/BoxStyled";
import GradientButton from "@/shared/buttons/GradientButton";
import OutlineButton from "@/shared/buttons/OutlineButton";
import FormStyled from "@/shared/FormStyled";
import FullLoadingOverlay from "@/shared/FullLoadingOverlay";
import PassInput from "@/shared/PassInput";
import Typography from "@/shared/Typography";
import React from "react";

/**
 * SignupForm component for user registration.
 *
 * @param {SignupFormProps} props - The props for the SignupForm component.
 * @param {function} props.setAuthState - Function to set the authentication state.
 * @param {object} props.authState - The current authentication state.
 * @returns {JSX.Element} - The rendered signup form component.
 */
const SignupForm: React.FC<SignupFormProps> = ({ setAuthState, authState }) => {

    const classes = styles();

    let data;

    try {
        data = useSignupForm(setAuthState, authState);
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
        <BoxStyled className={classes.form}>
            <Typography type="h2">signup</Typography>
            <FormStyled>
                <InputBoxStyled>
                    <TextInputStyled name='username' value={formData.username} handleChange={handleChange} />
                    <TextInputStyled name='firstname' value={formData.firstname} handleChange={handleChange} />
                    <TextInputStyled name='lastname' value={formData.lastname} handleChange={handleChange} />
                    <TextInputStyled name='email' value={formData.email} handleChange={handleChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleChange} />
                    <PassInput name='confirmPassword' value={formData.confirmPassword} handleChange={handleChange} />
                </InputBoxStyled>
            </FormStyled>
            <GradientButton onClick={handleSubmit} />
            <Typography type="h4">already have an account?</Typography>
            <OutlineButton onClick={handleLoginClick} name="login" />
        </BoxStyled>
    );
};

export default withErrorBoundary(SignupForm);