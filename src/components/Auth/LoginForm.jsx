import { useState } from "react";
import styles from "./styles/loginFormStyles";
import { useDispatch } from "react-redux";
import { authenticate, overlay, signup } from "../../redux/formViewReducer";
import { LOGIN_URL } from "../../constants/ApiPath";
import { fetchLogin } from "../../api/authRequests";
import { loadAuth } from "../../redux/authReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const LoginForm = () => {

    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const classes = styles();

    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const loginMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await fetchLogin(LOGIN_URL, formData);
            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["posts", "user", "chat"]);
            dispatch(loadAuth(data));
            dispatch(overlay());
            dispatch(authenticate());
            console.log("user login was success");
        },
        onError: (error, variables, context) => {
            console.log("error on login:", error.message)
        }
    });

    const handleLoginForm = async (event) => {
        event.preventDefault();
        loginMutation.mutate(formData);
    }

    return (
        <>
            <div className={classes.login}>
                <h1>Login</h1>
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
                    <button type='button' onClick={handleLoginForm}>login</button>
                </form>
                <h3>don't have an account?</h3>
                <button type='button' onClick={() => dispatch(signup())}>signup</button>
            </div>
        </>
    )
}

export default LoginForm