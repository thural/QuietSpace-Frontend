import { useState } from "react";
import styles from "./styles/loginFormStyles";
import { LOGIN_URL } from "../../constants/ApiPath";
import { fetchLogin } from "../../api/authRequests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore } from "../../hooks/zustand";
import { Button, Text, Title } from "@mantine/core";


const LoginForm = ({ setAuthState }) => {

    const queryClient = useQueryClient();
    const { setAuthData } = authStore();


    const [formData, setFormData] = useState({ email: "", password: "" });


    const loginMutation = useMutation({
        mutationKey: ["auth"],
        mutationFn: async (formData) => {
            const response = await fetchLogin(LOGIN_URL, formData);
            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["posts", "user", "chats"]);
            queryClient.setQueryData("auth", data);
            setAuthData(data);
        },
        onError: (error, variables, context) => {
            console.log("error on login:", error.message)
        },
    });


    const handleLoginForm = async (event) => {
        event.preventDefault();
        loginMutation.mutate(formData);
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }


    const classes = styles();


    return (
        <>
            <div className={classes.login}>
                <Title order={2}>Login</Title>
                <form className='login form'>
                    <div className="login input">
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
                    </div>
                    <Button
                        className="button"
                        fullWidth
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                        onClick={handleLoginForm}>
                        submit
                    </Button>
                </form>
                <Text className="signup-prompt">don't have an account?</Text>
                <Button className="button" variant="outline" onClick={() => setAuthState("signup")}>signup</Button>
            </div>
        </>
    )
}

export default LoginForm