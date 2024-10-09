import styles from "./styles/signupFormStyles"
import React, { useEffect, useState } from "react";
import { Button, LoadingOverlay, Text, Title } from "@mantine/core";
import useJwtAuth from "../../hooks/useJwtAuth";

const SignupForm = ({ setAuthState, authState }) => {

    const classes = styles();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        role: "user",
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });



    const onLoadFn = () => {
        setIsLoading(true);
    }

    const onSuccessFn = () => {
        setIsLoading(false);
        setAuthState({ page: "activation", formData });
    }

    const onErrorFn = (error) => {
        setIsLoading(false);
        resetAuthData();
        setError(error);
        setIsError(true);
    }


    const { signup } = useJwtAuth({ onSuccessFn, onErrorFn, onLoadFn });


    useEffect(() => {
        setFormData({ ...formData, ...authState.formData })
    }, []);


    const handleSubmit = async (event) => {
        const { password, confirmPassword } = formData;
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("passwords don't match, please try again");
            delete formData["confirmPassword"];
        } else {
            signup(formData, setAuthState);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const TextInput = ({ name, value }) => (
        <input
            type='text'
            name={name}
            placeholder={name}
            value={value}
            onChange={handleChange}
        />
    );

    const PassInput = ({ name, value }) => (
        <input
            type='password'
            name={name}
            placeholder={name}
            value={value}
            onChange={handleChange}
        />
    );


    if (isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
    if (isError) return <h1>{`could not authenticate! 🔥 error: ${error}`}</h1>

    return (
        <div className={classes.signup}>
            <Title order={2}>Signup</Title>
            <form className='signup-form'>
                <div className="signup input">
                    <TextInput name='username' value={formData.username} />
                    <TextInput name='firstname' value={formData.firstname} />
                    <TextInput name='lastname' value={formData.lastname} />
                    <TextInput name='email' value={formData.email} />
                    <PassInput name='password' value={formData.password} />
                    <PassInput name='confirmPassword' value={formData.confirmPassword} />
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