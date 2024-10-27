import { AuthPages, AuthState, SetAuthState, SignupBody } from "@/types/authTypes";
import useJwtAuth from "@/services/auth/useJwtAuth";
import { ChangeEvent, useEffect, useState } from "react";

export const useSignupForm = (setAuthState: SetAuthState, authState: AuthState) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [formData, setFormData] = useState<SignupBody>({
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
        setAuthState({ page: AuthPages.ACTIVATION, formData });
    };

    const onErrorFn = (error: Error) => {
        setIsLoading(false);
        setError(error);
        setIsError(true);
    };


    const { signup } = useJwtAuth({ onSuccessFn, onErrorFn, onLoadFn });


    useEffect(() => {
        setFormData({ ...formData, ...authState.formData });
    }, []);


    const handleSubmit = async (event: SubmitEvent) => {
        const { password, confirmPassword } = formData;
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("passwords don't match, please try again");
            setFormData((prev) => {
                const newData: SignupBody = { ...prev };
                newData.confirmPassword = '';
                return newData;
            });
        } else {
            signup(formData, setAuthState);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLoginClick = () => setAuthState({ page: AuthPages.LOGIN, formData });


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