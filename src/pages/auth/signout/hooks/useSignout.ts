import useJwtAuth from "@/services/auth/useJwtAuth";
import { useAuthStore } from "@/services/store/zustand";
import { getRefreshToken } from "@/utils/authUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const useSignout = () => {

    const { setAuthData, resetAuthData, setIsAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const onLoadFn = () => setIsLoading(true);

    const onSuccessFn = () => {
        queryClient.clear();
        setIsLoading(false);
        const refreshToken: string = getRefreshToken();
        setAuthData({ id: "", message: "", accessToken: "", refreshToken, userId: "" });
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