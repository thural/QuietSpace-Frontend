import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/auth/authStyles";
import { AuthPages, AuthState } from "@/types/authTypes";
import BoxStyled from "@components/shared/BoxStyled";
import Typography from "@components/shared/Typography";
import { useState } from "react";
import ActivationForm from "./ActivationForm";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

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
                <Typography className="brand" size="4rem" type="h1">QuietSpace</Typography>
                <Typography className="primary-text" size="1.5rem" >social media without distraction</Typography>
                <Typography className="secondary-text">where free speech and privacy is the priority</Typography>
            </BoxStyled>
            <RenderResult />
        </BoxStyled>
    )
}

export default withErrorBoundary(AuthContainer);