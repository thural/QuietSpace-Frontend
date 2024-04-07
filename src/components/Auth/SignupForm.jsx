import React, { useState } from "react";
import styles from "./styles/signupFormStyles"
import { fetchSignup } from "../../api/authRequests";
import { SIGNUP_URL } from "../../constants/ApiPath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore } from "../../hooks/zustand";
import { Button, Text, Title } from "@mantine/core";

const SignupForm = ({ setAuthState }) => {

    const queryClient = useQueryClient();
    const { setAuthData } = authStore();


    const [formData, setFormData] = useState({
        role: "user",
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });


    const signupMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await fetchSignup(SIGNUP_URL, formData);
            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["posts", "user", "chats"]);
            queryClient.setQueryData("auth", data);
            setAuthData(data);
        },
        onError: (error, variables, context) => {
            console.log("error on signup:", error.message)
        }
    });


    const handleSubmit = async (event) => {
        const { password, confirmPassword } = formData;
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("passwords does not match, try again!")
        }
        else {
            delete formData["confirmPassword"];
            signupMutation.mutate(formData);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value });
    }


    const classes = styles();


    return (
        <div className={classes.signup}>
            <Title order={2}>Signup</Title>
            <form className='signup-form'>
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
            </form>
            <Button
                className="submit-button"
                fullWidth
                radius="md"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                onClick={handleSubmit}>
                submit
            </Button>
            <Text className="login-prompt">already have account?</Text>
            <Button
                variant="outline"
                onClick={() => setAuthState("login")}>
                login
            </Button>
        </div>
    )
}

export default SignupForm