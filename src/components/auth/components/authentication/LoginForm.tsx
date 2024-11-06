import BoxStyled from "@components/shared/BoxStyled";
import GradientButton from "@components/shared/buttons/GradientButton";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import FormStyled from "@components/shared/FormStyled";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import PassInput from "@components/shared/PassInput";
import TextInput from "@components/shared/TextInput";
import Typography from "@components/shared/Typography";
import { useLoginForm } from "./hooks/useLoginForm";
import styles from "../registration/styles/formStyles";
import { AuthFormProps } from "@/types/authTypes";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import React from "react";

const LoginForm: React.FC<AuthFormProps> = ({ setAuthState, authState }) => {

    const classes = styles();
    let data = undefined;

    try {
        data = useLoginForm({ setAuthState, authState });
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error on activation form: ${(error as Error).message}`;
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

    if (isAuthenticating) return <FullLoadingOverlay />;
    if (isError) return <ErrorComponent message={`(!) could not authenticate! error: ${error}`} />;

    return (
        <BoxStyled className={classes.wrapper}>
            <Typography type="h2">login</Typography>
            <FormStyled>
                <BoxStyled className="input-box">
                    <TextInput name='email' value={formData.email} handleChange={handleFormChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleFormChange} />
                </BoxStyled>
                <GradientButton onClick={handleLoginForm} />
            </FormStyled>
            <Typography className="prompt">don't have an account?</Typography>
            <OutlineButton name="signup" onClick={handleSignupBtn} />
        </BoxStyled>
    );
};

export default withErrorBoundary(LoginForm);