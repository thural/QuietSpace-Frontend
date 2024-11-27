import { AuthResponse, AuthRequest } from "@/api/schemas/inferred/auth";
import { JwtToken } from "@/api/schemas/inferred/common";
import { AnyFunction } from "@/types/genericTypes";
import { getRefreshToken } from "@/utils/authUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchAccessToken, fetchActivation, fetchLogin, fetchLogout } from "../../api/requests/authRequests";
import { useAuthStore } from "../store/zustand";


export const usePostLogin = (authenticationNotice: Function) => {

    const { setAuthData } = useAuthStore();
    const navigate = useNavigate();

    const onSuccess = (data: AuthResponse) => {
        console.log("auth response was success");
        localStorage.setItem("refreshToken", data.refreshToken);
        setAuthData(data);
        navigate("/");
    }

    const onError = (error: Error) => {
        console.log("error on login:", error.message);
        authenticationNotice("failed to authenticate, error: ", error.message);
    }

    return useMutation({
        mutationFn: async (formData: AuthRequest) => {
            return fetchLogin(formData);
        },
        onSuccess,
        onError,
    });
}


export const usePostLogout = () => {

    const { data: authData, resetAuthData } = useAuthStore();
    const queryClient = useQueryClient();
    queryClient.removeQueries();
    localStorage.clear();

    const onSettled = () => {
        resetAuthData();
    }

    const onSuccess = () => {
        console.log("user logout was success");
    }

    const onError = (error: Error) => {
        console.log("error on logout:", error.message);
    }

    return useMutation({
        mutationFn: async () => {
            return await fetchLogout(authData.accessToken);
        },
        onSettled,
        onSuccess,
        onError
    });
}


export const useRefreshToken = () => {

    const { setAuthData } = useAuthStore();
    const refreshToken: JwtToken | null = getRefreshToken();

    const onSuccess = (data: AuthResponse) => {
        console.log("access token refresh was success");
        setAuthData(data)
    }

    const onError = (error: Error) => {
        // TODO: reset auth state if necessary
        console.log("error on fetching access token: ", error);
    }

    return useMutation({
        mutationFn: async () => {
            if (refreshToken === null) throw new Error("(!) refresh token is null");
            return await fetchAccessToken(refreshToken);
        },
        onSuccess,
        onError,
    });
}


export const useActivation = (onSuccess: AnyFunction, onError: AnyFunction) => {
    return useMutation({
        mutationFn: async (code: string) => {
            await fetchActivation(code);
        },
        onSuccess,
        onError
    });
}