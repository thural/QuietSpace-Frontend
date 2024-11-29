import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import InputBoxStyled from "@/components/shared/InputBoxStyled";
import TextInputStyled from "@/components/shared/TextInputStyled";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { AuthFormProps } from "@/types/authTypes";
import BoxStyled from "@components/shared/BoxStyled";
import GradientButton from "@components/shared/buttons/GradientButton";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import FormStyled from "@components/shared/FormStyled";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import PassInput from "@components/shared/PassInput";
import Typography from "@components/shared/Typography";
import React from "react";
import { useLoginForm } from "@/services/hook/auth/useLoginForm";
import styles from "@/styles/auth/formStyles";

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
                <InputBoxStyled>
                    <TextInputStyled name='email' value={formData.email} handleChange={handleFormChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleFormChange} />
                </InputBoxStyled>
                <GradientButton onClick={handleLoginForm} />
                <Typography type="h4">don't have an account?</Typography>
                <OutlineButton name="signup" onClick={handleSignupBtn} />
            </FormStyled>
        </BoxStyled>
    );
};

export default withErrorBoundary(LoginForm);