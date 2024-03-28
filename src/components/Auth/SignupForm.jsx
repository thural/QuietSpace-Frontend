import React, { useState } from "react";
import styles from "./styles/signupFormStyles"
import { fetchSignup } from "../../api/authRequests";
import { SIGNUP_URL } from "../../constants/ApiPath";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SignupForm = ({ setAuthState }) => {

    const queryClient = useQueryClient();
    const classes = styles();
    const [formData, setFormData] = useState({ role: "user", username: '', email: '', password: '', confirmPassword: '' });

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value });
    }

    const signupMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await fetchSignup(SIGNUP_URL, formData);
            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["posts", "user", "chat"]);
            queryClient.setQueryData("auth", data);
            console.log("user signup was success");
        },
        onError: (error, variables, context) => {
            console.log("error on signup:", error.message)
        }
    });

    const handleSubmit = async (event) => {
        const { password, confirmPassword } = formData;
        if (password !== confirmPassword) {
            alert("passwords does not match, try again!")
        }
        else {
            delete formData["confirmPassword"];
            event.preventDefault();
            signupMutation.mutate(formData);
        }
    }

    return (
        <div className={classes.signup}>
            <h1>Signup</h1>
            <form
                className='signup form'
                onSubmit={e => {
                    handleSubmit(e).then(() => console.log("overlay func is missing"))
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
            <button type='button' onClick={() => setAuthState("signup")}>login</button>
        </div>
    )
}

export default SignupForm