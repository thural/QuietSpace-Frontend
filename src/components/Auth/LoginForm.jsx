import React from "react";
import styles from "./styles/loginFormStyles";
import TextInput from "../Shared/TextInput";
import PassInput from "../Shared/PassInput";
import FillGradientBtn from "../Shared/FillGradientBtn";
import FillOutlineBtn from "../Shared/FillOutlineBtn";
import { Box, Text, Title } from "@mantine/core";
import { useLoginForm } from "./hooks/useLoginForm";
import FullLoadingOverlay from "../Shared/FillLoadingOverlay";

const LoginForm = ({ setAuthState, authState }) => {
    const classes = styles();
    const {
        formData,
        isAuthenticating,
        isError,
        error,
        handleLoginForm,
        handleChange,
        handleSignupBtn,
    } = useLoginForm(setAuthState, authState);

    if (isAuthenticating) return <FullLoadingOverlay />;
    if (isError) return <h1>{`could not authenticate! 🔥 error: ${error}`}</h1>;

    return (
        <div className={classes.login}>
            <Title order={2}>Login</Title>
            <form className='login form'>
                <Box className="login input">
                    <TextInput name='email' value={formData.email} handleChange={handleChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleChange} />
                </Box>
                <FillGradientBtn onClick={handleLoginForm} />
            </form>
            <Text className="signup-prompt">don't have an account?</Text>
            <FillOutlineBtn name="signup" onClick={handleSignupBtn} />
        </div>
    );
};

export default LoginForm;