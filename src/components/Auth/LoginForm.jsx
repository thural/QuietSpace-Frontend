import { Box, Text, Title } from "@mantine/core";
import React from "react";
import GradientButton from "../Shared/buttons/GradientButton";
import OutlineButton from "../Shared/buttons/OutlineButton";
import FullLoadingOverlay from "../Shared/FullLoadingOverlay";
import PassInput from "../Shared/PassInput";
import TextInput from "../Shared/TextInput";
import { useLoginForm } from "./hooks/useLoginForm";
import styles from "./styles/formStyles";

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
        <Box className={classes.wrapper}>
            <Title order={2}>login</Title>
            <form>
                <Box className="input-box">
                    <TextInput name='email' value={formData.email} handleChange={handleChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleChange} />
                </Box>
                <GradientButton onClick={handleLoginForm} />
            </form>
            <Text className="prompt">don't have an account?</Text>
            <OutlineButton name="signup" onClick={handleSignupBtn} />
        </Box>
    );
};

export default LoginForm;