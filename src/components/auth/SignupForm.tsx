import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import InputBoxStyled from "@/components/shared/InputBoxStyled";
import TextInputStyled from "@/components/shared/TextInputStyled";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import { SignupFormProps } from "@/types/authTypes";
import BoxStyled from "@components/shared/BoxStyled";
import GradientButton from "@components/shared/buttons/GradientButton";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import FormStyled from "@components/shared/FormStyled";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import PassInput from "@components/shared/PassInput";
import Typography from "@components/shared/Typography";
import React from "react";
import { useSignupForm } from "../../services/hook/auth/useSignupForm";
import styles from "../../styles/auth/formStyles";

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
                <InputBoxStyled>
                    <TextInputStyled name='username' value={formData.username} handleChange={handleChange} />
                    <TextInputStyled name='firstname' value={formData.firstname} handleChange={handleChange} />
                    <TextInputStyled name='lastname' value={formData.lastname} handleChange={handleChange} />
                    <TextInputStyled name='email' value={formData.email} handleChange={handleChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleChange} />
                    <PassInput name='confirmPassword' value={formData.confirmPassword} handleChange={handleChange} />
                </InputBoxStyled>
            </FormStyled>
            <Typography className="prompt">already have account?</Typography>
            <OutlineButton onClick={handleLoginClick} name="login" />
            <GradientButton onClick={handleSubmit} />
        </BoxStyled>
    );
};

export default withErrorBoundary(SignupForm);