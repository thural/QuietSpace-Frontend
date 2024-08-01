import React, {useState} from "react";
import styles from "./styles/authStyles"
import SignupForm from "../../components/Auth/SignupForm";
import LoginForm from "../../components/Auth/LoginForm";
import { Text, Title } from "@mantine/core";
import { loadAccessToken } from "../../hooks/useToken";
import { useAuthStore } from "../../hooks/zustand";

const AuthPage = () => {

    const [authState, setAuthState] = useState("login");
    const {isLoading, isError, error} = loadAccessToken();


    const {setForceLogin} = useAuthStore();
    const classes = styles();

    if(isError) {
        setForceLogin(true);
        setAuthState("login");
    }

    if(isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;

    return (
            <div className={classes.auth}>
                <div className="greeting-text">
                    <Title className="brand" size="2.5rem" order={1}>Quiet Space</Title>
                    <Text className="primary-text" size="1.5rem" >social media without distraction</Text>
                    <Text className="secondary-text">where free speech and privacy is the priority</Text>
                </div>
                {
                    authState === "signup" ? <SignupForm setAuthState={setAuthState} /> :
                    authState === "login" ? <LoginForm setAuthState={setAuthState} /> : null
                }
            </div>
    )
}

export default AuthPage