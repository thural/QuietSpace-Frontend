import useJwtAuth from "@/services/auth/useJwtAuth";
import { useAuthStore } from "@/services/store/zustand";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthFormProps, AuthPages } from "@/types/authTypes";
import { Auth } from "@/api/schemas/inferred/auth";


export const useLoginForm = ({ setAuthState, authState }: AuthFormProps) => {

    const { setAuthData, resetAuthData, setIsAuthenticated } = useAuthStore();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const onLoadFn = () => setIsAuthenticating(true);

    const onSuccessFn = (data: Auth): void => {
        setIsAuthenticating(false);
        setIsAuthenticated(true);
        setAuthData(data);
        navigate("/");
    };

    const onErrorFn = (error: Error): void => {
        setIsAuthenticating(false);
        resetAuthData();
        setError(error);
        setIsError(true);
    };

    const { authenticate } = useJwtAuth({ onSuccessFn, onErrorFn, onLoadFn });

    useEffect(() => {
        setFormData({ ...formData, ...authState.formData });
    }, []);

    const handleLoginForm = async (event: Event): Promise<void> => {
        event.preventDefault();
        authenticate(formData);
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const { name, value }: { name: string; value: string } = target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignupBtn = () => setAuthState({ page: AuthPages.SIGNNUP, formData });

    return {
        formData,
        isAuthenticating,
        isError,
        error,
        handleLoginForm,
        handleFormChange,
        handleSignupBtn,
    };
};