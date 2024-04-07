import React, {useState} from "react";
import styles from "./styles/authStyles"
import SignupForm from "../../components/Auth/SignupForm";
import LoginForm from "../../components/Auth/LoginForm";
import { Text, Title } from "@mantine/core";

const AuthPage = () => {

    const [authState, setAuthState] = useState("login");

    const classes = styles();

    return (
        <>
            <div className={classes.auth}>
                <div className="greeting-text">
                    <Title size="2.5rem" order={1}>Quiet Space</Title>
                    <Text size="1.5rem" >social media without distraction</Text>
                    <Text className="secondary-text">where free speech and privacy is priority</Text>
                </div>
                {
                    authState == "signup" ? <SignupForm setAuthState={setAuthState} /> :
                    authState == "login" ? <LoginForm setAuthState={setAuthState}/> : null
                }
            </div>
        </>
    )
}

export default AuthPage