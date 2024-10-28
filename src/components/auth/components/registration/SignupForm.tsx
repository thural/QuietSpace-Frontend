import BoxStyled from "@components/shared/BoxStyled";
import GradientButton from "@components/shared/buttons/GradientButton";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import FormStyled from "@components/shared/FormStyled";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import PassInput from "@components/shared/PassInput";
import TextInput from "@components/shared/TextInput";
import Typography from "@components/shared/Typography";
import { useSignupForm } from "./hooks/useSignupForm";
import styles from "./styles/formStyles";
import React from "react";
import { SignupFormProps } from "@/types/authTypes";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import ErrorComponent from "@/components/shared/error/ErrorComponent";

const SignupForm: React.FC<SignupFormProps> = ({ setAuthState, authState }) => {

    const classes = styles();

    let data = undefined;

    try {
        data = useSignupForm(setAuthState, authState);
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error on acitvation form: ${(error as Error).message}`;
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
        <BoxStyled className={classes.wrapper}>
            <Typography type="h2">signup</Typography>
            <FormStyled>
                <BoxStyled className="input-box">
                    <TextInput name='username' value={formData.username} handleChange={handleChange} />
                    <TextInput name='firstname' value={formData.firstname} handleChange={handleChange} />
                    <TextInput name='lastname' value={formData.lastname} handleChange={handleChange} />
                    <TextInput name='email' value={formData.email} handleChange={handleChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleChange} />
                    <PassInput name='confirmPassword' value={formData.confirmPassword} handleChange={handleChange} />
                </BoxStyled>
            </FormStyled>
            <GradientButton onClick={handleSubmit} />
            <Typography className="prompt">already have account?</Typography>
            <OutlineButton onClick={handleLoginClick} name="login" />
        </BoxStyled>
    );
};

export default withErrorBoundary(SignupForm);