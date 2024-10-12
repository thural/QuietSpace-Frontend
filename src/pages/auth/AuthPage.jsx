import { Text, Title } from "@mantine/core";
import React, { useState } from "react";
import ActivationForm from "../../components/Auth/ActivationForm";
import LoginForm from "../../components/Auth/LoginForm";
import SignupForm from "../../components/Auth/SignupForm";
import BoxStyled from "../../components/Shared/BoxStyled";
import styles from "./styles/authStyles";

const AuthPage = () => {

    const classes = styles();

    const [authState, setAuthState] = useState({ page: "login", formData: null });

    const RenderResult = () => {
        if (authState.page === "signup") return <SignupForm setAuthState={setAuthState} authState={authState} />
        else if (authState.page === "login") return <LoginForm setAuthState={setAuthState} authState={authState} />
        else if (authState.page === "activation") return <ActivationForm setAuthState={setAuthState} authState={authState} />
        else return null;
    }


    return (
        <BoxStyled className={classes.auth}>
            <BoxStyled className="greeting-text">
                <Title className="brand" size="2.5rem" order={1}>Quiet Space</Title>
                <Text className="primary-text" size="1.5rem" >social media without distraction</Text>
                <Text className="secondary-text">where free speech and privacy is the priority</Text>
            </BoxStyled>
            <RenderResult />
        </BoxStyled>
    )
}

export default AuthPage