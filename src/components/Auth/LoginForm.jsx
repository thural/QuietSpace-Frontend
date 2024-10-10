import styles from "./styles/loginFormStyles";
import useJwtAuth from "../../hooks/useJwtAuth";
import TextInput from "../Shared/TextInput";
import PassInput from "../Shared/PassInput";
import { useEffect, useState } from "react";
import { Box, LoadingOverlay, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks/zustand";
import FillGradientBtn from "../Shared/FillGradientBtn";
import FillOutlineBtn from "../Shared/FillOutlineBtn";


const LoginForm = ({ setAuthState, authState }) => {

    const classes = styles();

    const { setAuthData, resetAuthData, setIsAuthenticated } = useAuthStore();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);


    const onLoadFn = () => {
        setIsAuthenticating(true);
    }

    const onSuccessFn = (data) => {
        setIsAuthenticating(false);
        setIsAuthenticated(true);
        setAuthData(data);
        navigate("/");
    }

    const onErrorFn = (error) => {
        setIsAuthenticating(false);
        resetAuthData();
        setError(error);
        setIsError(true);
    }


    const { authenticate } = useJwtAuth({ onSuccessFn, onErrorFn, onLoadFn });


    useEffect(() => {
        setFormData({ ...formData, ...authState.formData })
    }, []);


    const handleLoginForm = async (event) => {
        event.preventDefault();
        authenticate(formData);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSignupBtn = () => setAuthState({ page: "signup", formData });


    if (isAuthenticating) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    if (isError) return <h1>{`could not authenticate! 🔥 error: ${error}`}</h1>


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
    )
}

export default LoginForm