import React, {useEffect, useRef, useState} from "react";
import styles from "./styles/authStyles"
import SignupForm from "../../components/Auth/SignupForm";
import LoginForm from "../../components/Auth/LoginForm";
import { Text, Title } from "@mantine/core";
import { useAuthStore } from "../../hooks/zustand";

const AuthPage = () => {

    const [authState, setAuthState] = useState("login");
    const { data: authData, setAuthData } = useAuthStore();
    const hasRun = useRef(false);
    
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        setAuthData({ message: "", accessToken, refreshToken, userId: "" })
    }, []);

    const classes = styles();

    if(authData.accessToken !== "" || hasRun.current === false) return <Text ta="center">loading...</Text>

    return (
            <div className={classes.auth}>
                <div className="greeting-text">
                    <Title className="brand" size="2.5rem" order={1}>Quiet Space</Title>
                    <Text className="primary-text" size="1.5rem" >social media without distraction</Text>
                    <Text className="secondary-text">where free speech and privacy is priority</Text>
                </div>
                {
                    authState === "signup" ? <SignupForm setAuthState={setAuthState} /> :
                    authState === "login" ? <LoginForm setAuthState={setAuthState}/> : null
                }
            </div>
    )
}

export default AuthPage