import useJwtAuth from "@/services/hook/auth/useJwtAuth";
import { useAuthStore } from "@/services/store/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const useSignout = () => {

    const { resetAuthData, setIsAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const onLoadFn = () => setIsLoading(true);

    const onSuccessFn = () => {
        queryClient.clear();
        setIsLoading(false);
        resetAuthData();
        setIsAuthenticated(false);
        navigate("/login");
    }

    const onErrorFn = (error: Error) => {
        setIsLoading(false);
        resetAuthData();
        setError(error);
        setIsError(true);
    }

    const { signout } = useJwtAuth({ onSuccessFn, onErrorFn, onLoadFn });

    useEffect(signout, []);

    return { isLoading, isError, error }
}