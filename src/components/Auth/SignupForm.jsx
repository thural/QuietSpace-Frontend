import React from "react";
import { Text, Title } from "@mantine/core";
import styles from "./styles/signupFormStyles";
import TextInput from "../Shared/TextInput";
import PassInput from "../Shared/PassInput";
import FillGradientBtn from "../Shared/FillGradientBtn";
import FillOutlineBtn from "../Shared/FillOutlineBtn";
import FullLoadingOverlay from "../Shared/FillLoadingOverlay";
import { useSignupForm } from "./hooks/useSignupForm";

const SignupForm = ({ setAuthState, authState }) => {
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
    if (isError) return <h1>{`could not authenticate! 🔥 error: ${error}`}</h1>;

    return (
        <div className={classes.signup}>
            <Title order={2}>Signup</Title>
            <form className='signup-form'>
                <div className="signup input">
                    <TextInput name='username' value={formData.username} handleChange={handleChange} />
                    <TextInput name='firstname' value={formData.firstname} handleChange={handleChange} />
                    <TextInput name='lastname' value={formData.lastname} handleChange={handleChange} />
                    <TextInput name='email' value={formData.email} handleChange={handleChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleChange} />
                    <PassInput name='confirmPassword' value={formData.confirmPassword} handleChange={handleChange} />
                </div>
            </form>
            <FillGradientBtn onClick={handleSubmit} />
            <Text className="login-prompt">already have account?</Text>
            <FillOutlineBtn onClick={handleLoginClick} name="login" />
        </div>
    );
};

export default SignupForm;