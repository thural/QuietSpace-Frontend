import React, {useState} from "react";
import styles from "./styles/authStyles"
import SignupForm from "../../components/Auth/SignupForm";
import LoginForm from "../../components/Auth/LoginForm";

const AuthPage = () => {

    const [authState, setAuthState] = useState("login");

    const classes = styles();

    return (
        <>
            <div className={classes.auth}>
                <div className="greeting-text">
                    <h1 className="brand">Quiet Space</h1>
                    <h2 className="primary-text">social media without the distraction</h2>
                    <h3 className="secondary-text">where free speech and privacy is our priority</h3>
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