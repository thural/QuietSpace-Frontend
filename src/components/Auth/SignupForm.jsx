import styles from "./styles/signupFormStyles"
import React, { useEffect, useState } from "react";
import { Button, Text, Title } from "@mantine/core";
import { usePostSignup } from "../../hooks/useAuthData";

const SignupForm = ({ setAuthState, authState }) => {

    const signupMutation = usePostSignup(setAuthState);

    const [formData, setFormData] = useState({
        role: "user",
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        setFormData({ ...formData, ...authState.formData })
    }, [])

    const handleSubmit = async (event) => {
        const { password, confirmPassword } = formData;
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("passwords don't match, please try again");
            delete formData["confirmPassword"];
        }
        else {
            signupMutation.mutate(formData);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
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
                        name='firstname'
                        placeholder="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                    />
                    <input
                        type='text'
                        name='lastname'
                        placeholder="lastname"
                        value={formData.lastname}
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
                onClick={() => setAuthState({ page: "login", formData })}>
                login
            </Button>
        </div>
    )
}

export default SignupForm