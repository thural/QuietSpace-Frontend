import ActivationForm from "../components/activation/ActivationForm";
import LoginForm from "../components/authentication/LoginForm";
import SignupForm from "../components/registration/SignupForm";
import BoxStyled from "@components/shared/BoxStyled";
import Typography from "@components/shared/Typography";
import React, { useState } from "react";
import styles from "./styles/authStyles";

const AuthContainer = () => {

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
                <Typography className="brand" size="2.5rem" type="h1">Quiet Space</Typography>
                <Typography className="primary-text" size="1.5rem" >social media without distraction</Typography>
                <Typography className="secondary-text">where free speech and privacy is the priority</Typography>
            </BoxStyled>
            <RenderResult />
        </BoxStyled>
    )
}

export default AuthContainer