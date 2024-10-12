import { Box, Text, Title } from "@mantine/core";
import React from "react";
import GradientButton from "../Shared/buttons/GradientButton";
import OutlineButton from "../Shared/buttons/OutlineButton";
import FullLoadingOverlay from "../Shared/FullLoadingOverlay";
import PassInput from "../Shared/PassInput";
import TextInput from "../Shared/TextInput";
import { useSignupForm } from "./hooks/useSignupForm";
import styles from "./styles/formStyles";

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
        <Box className={classes.wrapper}>
            <Title order={2}>signup</Title>
            <form>
                <Box className="input-box">
                    <TextInput name='username' value={formData.username} handleChange={handleChange} />
                    <TextInput name='firstname' value={formData.firstname} handleChange={handleChange} />
                    <TextInput name='lastname' value={formData.lastname} handleChange={handleChange} />
                    <TextInput name='email' value={formData.email} handleChange={handleChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleChange} />
                    <PassInput name='confirmPassword' value={formData.confirmPassword} handleChange={handleChange} />
                </Box>
            </form>
            <GradientButton onClick={handleSubmit} />
            <Text className="prompt">already have account?</Text>
            <OutlineButton onClick={handleLoginClick} name="login" />
        </Box>
    );
};

export default SignupForm;