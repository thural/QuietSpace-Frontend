import { useState, useEffect } from "react";
import useJwtAuth from "../../hooks/useJwtAuth";

export const useSignupForm = (setAuthState, authState) => {
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
    };

    const onSuccessFn = () => {
        setIsLoading(false);
        setAuthState({ page: "activation", formData });
    };

    const onErrorFn = (error) => {
        setIsLoading(false);
        setError(error);
        setIsError(true);
    };

    const { signup } = useJwtAuth({ onSuccessFn, onErrorFn, onLoadFn });

    useEffect(() => {
        setFormData({ ...formData, ...authState.formData });
    }, []);

    const handleSubmit = async (event) => {
        const { password, confirmPassword } = formData;
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("passwords don't match, please try again");
            setFormData((prev) => {
                const newData = { ...prev };
                delete newData.confirmPassword;
                return newData;
            });
        } else {
            signup(formData, setAuthState);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLoginClick = () => setAuthState({ page: "login", formData });

    return {
        isLoading,
        isError,
        error,
        formData,
        handleSubmit,
        handleChange,
        handleLoginClick
    };
};