import React, { useState } from "react";
import styles from "./styles/authStyles"
import SignupForm from "../../components/Auth/SignupForm";
import LoginForm from "../../components/Auth/LoginForm";
import ActivationForm from "../../components/Auth/ActivationForm";
import { Text, Title } from "@mantine/core";

const AuthPage = () => {

    const [authState, setAuthState] = useState({ page: "login", formData: null });

    const classes = styles();


    return (
        <div className={classes.auth}>
            <div className="greeting-text">
                <Title className="brand" size="2.5rem" order={1}>Quiet Space</Title>
                <Text className="primary-text" size="1.5rem" >social media without distraction</Text>
                <Text className="secondary-text">where free speech and privacy is the priority</Text>
            </div>
            {
                authState.page === "signup" ? <SignupForm setAuthState={setAuthState} authState={authState} /> :
                    authState.page === "login" ? <LoginForm setAuthState={setAuthState} authState={authState} /> :
                        authState.page === "activation" ? <ActivationForm setAuthState={setAuthState} authState={authState} /> : null
            }
        </div>
    )
}

export default AuthPage