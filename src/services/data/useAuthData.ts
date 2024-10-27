import { fetchAccessToken, fetchActivation, fetchLogin, fetchLogout, fetchSignup } from "../../api/requests/authRequests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/zustand";
import { AuthBody, Auth, RefreshToken } from "@/api/schemas/inferred/auth";
import { AnyFunction } from "@/types/genericTypes";
import { JwtToken } from "@/api/schemas/inferred/common";


export const usePostLogin = (authenticationNotice: Function) => {

    const { setAuthData } = useAuthStore();
    const navigate = useNavigate();

    const onSuccess = (data: Auth) => {
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
        mutationFn: async (formData: AuthBody) => {
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
    const refreshToken: JwtToken | null = localStorage.getItem("refreshToken");

    const onSuccess = (data: RefreshToken) => {
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