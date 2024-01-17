import React, {useEffect} from "react";
import styles from "./styles/authStyles"
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import {useDispatch, useSelector} from "react-redux";
import {login, signup} from "../../redux/formViewReducer";

const AuthPage = () => {
    const formView = useSelector(state => state.formViewReducer);
    const classes = styles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(login())
    }, []);

    return (
        <>
            <div className={classes.auth}>
                <div className="greeting-text">
                    <h1 className="brand">Quiet Space</h1>
                    <h2 className="primary-text">social media without the distraction</h2>
                    <h3 className="secondary-text">where free speech and privacy is our priority</h3>
                </div>
                {
                    formView.signup ? <SignupForm/> : formView.login ? <LoginForm/> : null
                }
            </div>
        </>
    )
}

export default AuthPage