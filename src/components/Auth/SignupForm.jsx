import React, {useState} from "react";
import Overlay from "../Overlay";
import styles from "./styles/signupFormStyles"
import {useDispatch} from "react-redux";
import {login, overlay} from "../../redux/formViewReducer";
import {fetchSignup} from "../../api/authRequests";
import {SIGNUP_URL} from "../../constants/ApiPath";
import {loadAuth} from "../../redux/authReducer";

const SignupForm = () => {
    const classes = styles()

    const dispatch = useDispatch()
    const [formData, setFormData] = useState({role:"user", username:'', email: '', password: '', confirmPassword: ''})

    const handleChange = (event) => {
        const {name, value} = event.target
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (event) => {
        const {password, confirmPassword} = formData;
        if (password !== confirmPassword) alert("passwords does not match, try again!")
        else {
            delete formData["confirmPassword"];
            event.preventDefault();
            const authResponse = await fetchSignup(SIGNUP_URL, formData);
            const authResponseData = await authResponse.json();
            dispatch(loadAuth(authResponseData));
            dispatch(overlay());
        }
    }

    return (
        <>
            <Overlay/>
            <div className={classes.signup}>
                <h1>Signup</h1>
                <form
                    className='signup form'
                    onSubmit={e => {
                        handleSubmit(e).then(dispatch(overlay()))

                    }}>
                    <div className="signup input">
                        <input
                            type='text'
                            name='username'
                            placeholder="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <input
                            type='text'
                            name='email'
                            placeholder="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type='password'
                            name='password'
                            placeholder="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <input
                            type='password'
                            name='confirmPassword'
                            placeholder="confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <button type='button' onClick={handleSubmit}>submit</button>
                </form>
                <h3>already have an account?</h3>
                <button type='button' onClick={() => dispatch(login())}>login</button>
            </div>
        </>
    )
}

export default SignupForm