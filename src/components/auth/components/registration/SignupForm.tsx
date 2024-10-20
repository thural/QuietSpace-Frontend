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
import { SignupFormProps } from "@components/shared/types/authTypes";

const SignupForm: React.FC<SignupFormProps> = ({ setAuthState, authState }) => {
    const classes = styles();
    const {
        isLoading,
        isError,
        error,
        formData,
        handleSubmit,
        handleChange,
        handleLoginClick
    } = useSignupForm(setAuthState, authState);

    if (isLoading) return <FullLoadingOverlay />;
    if (isError) return <Typography type="h1">{`could not authenticate! 🔥 error: ${error}`}</Typography>;

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

export default SignupForm;