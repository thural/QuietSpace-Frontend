import useJwtAuth from "@hooks/useJwtAuth";
import { useAuthStore } from "@hooks/zustand";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLoginForm = (setAuthState, authState) => {
    const { setAuthData, resetAuthData, setIsAuthenticated } = useAuthStore();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const onLoadFn = () => {
        setIsAuthenticating(true);
    };

    const onSuccessFn = (data) => {
        setIsAuthenticating(false);
        setIsAuthenticated(true);
        setAuthData(data);
        navigate("/");
    };

    const onErrorFn = (error) => {
        setIsAuthenticating(false);
        resetAuthData();
        setError(error);
        setIsError(true);
    };

    const { authenticate } = useJwtAuth({ onSuccessFn, onErrorFn, onLoadFn });

    useEffect(() => {
        setFormData({ ...formData, ...authState.formData });
    }, []);

    const handleLoginForm = async (event) => {
        event.preventDefault();
        authenticate(formData);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignupBtn = () => setAuthState({ page: "signup", formData });

    return {
        formData,
        isAuthenticating,
        isError,
        error,
        handleLoginForm,
        handleChange,
        handleSignupBtn,
    };
};