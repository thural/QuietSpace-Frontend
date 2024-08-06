import styles from "./styles/loginFormStyles";
import { useEffect, useState } from "react";
import { Button, LoadingOverlay, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import useJwtAuth from "../../hooks/useJwtAuth";
import { useAuthStore } from "../../hooks/zustand";


const LoginForm = ({ setAuthState, authState }) => {
    const { setAuthData, resetAuthData, setIsAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });

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
        console.log("auth data has been set");
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


    const classes = styles();

    if (isAuthenticating) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    if (isError) return <h1>{`could not authenticate! 🔥 error: ${error}`}</h1>

    return (
        <>
            <div className={classes.login}>
                <Title order={2}>Login</Title>
                <form className='login form'>
                    <div className="login input">
                        <input
                            type='text'
                            name='email'
                            placeholder="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type='password'
                            name='password'
                            placeholder="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <Button
                        className="button"
                        fullWidth
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                        onClick={handleLoginForm}>
                        submit
                    </Button>
                </form>
                <Text className="signup-prompt">don't have an account?</Text>
                <Button
                    className="button"
                    variant="outline"
                    onClick={handleSignupBtn}>
                    signup
                </Button>
            </div>
        </>
    )
}

export default LoginForm