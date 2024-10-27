import ActivationForm from "../components/activation/ActivationForm";
import LoginForm from "../components/authentication/LoginForm";
import SignupForm from "../components/registration/SignupForm";
import BoxStyled from "@components/shared/BoxStyled";
import Typography from "@components/shared/Typography";
import { AuthState, AuthPages } from "@/types/authTypes";
import { useState } from "react";
import styles from "./styles/authStyles";

const AuthContainer = () => {

    const classes = styles();

    const [authState, setAuthState] = useState<AuthState>({
        page: AuthPages.LOGIN,
        formData: { email: "", password: "" }
    });

    const RenderResult = () => {
        if (authState.page === AuthPages.SIGNNUP) return <SignupForm setAuthState={setAuthState} authState={authState} />;
        if (authState.page === AuthPages.LOGIN) return <LoginForm setAuthState={setAuthState} authState={authState} />;
        if (authState.page === AuthPages.ACTIVATION) return <ActivationForm setAuthState={setAuthState} authState={authState} />;
    }


    return (
        <BoxStyled className={classes.auth}>
            <BoxStyled className="greeting-text">
                <Typography className="brand" size="2.5rem" type="h1">QuietSpace</Typography>
                <Typography className="primary-text" size="1.5rem" >social media without distraction</Typography>
                <Typography className="secondary-text">where free speech and privacy is the priority</Typography>
            </BoxStyled>
            <RenderResult />
        </BoxStyled>
    )
}

export default AuthContainer