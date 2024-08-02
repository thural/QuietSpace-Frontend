import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./zustand";
import { fetchAccessToken, fetchActivation, fetchLogin, fetchSignup } from "../api/authRequests";
import { useNavigate } from "react-router-dom";

export const usePostLogin = () => {

    const { setAuthData, setForceLogin } = useAuthStore();
    const navigate = useNavigate();

    const onSuccess = (data, variables, context) => {
        console.log("login response from backend was success");
        localStorage.setItem("refreshToken", data.refreshToken);
        setAuthData(data);
        setForceLogin(false);
        navigate("/");
    }

    const onError = (error, variables, context) => {
        console.log("error on login:", error.message);
    }

    return useMutation({
        mutationFn: async (formData) => {
            const response = await fetchLogin(formData);
            return await response.json();
        },
        onSuccess,
        onError,
        staleTime: false,
        refetchInterval: false,
        gcTime: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
    });
}

export const usePostLogout = () => {

    const queryClient = useQueryClient();
    const { setAuthData, resetAuthData } = useAuthStore();

    queryClient.removeQueries()

    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["posts", "user", "chat"]);
        console.log("user logout was success");
        localStorage.clear();
        resetAuthData();
    }

    const onError = (error, variables, context) => {
        console.log("error on logout:", error.message);
        resetAuthData();
    }

    return useMutation({
        mutationFn: async () => {
            const response = await fetchLogout(auth["accessToken"]);
            return await response.json();
        },
        onSuccess,
        onError
    });
}

export const usePostSignup = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const onSuccess = (data, variables, context) => {
        console.log("email in useSignup context: ", context.email);
        navigate("/activation", { state: { email: context.email } })
    }

    const onError = (error, variables, context) => {
        console.log("email in useSignup context: ", context.email);
        console.log("error on signup:", error.message)
    }

    return useMutation({
        mutationFn: async (formData) => {
            console.log("form data on signup mutation: ", formData);
            const response = await fetchSignup(formData);
            return { email: formData.email };
        },
        onSuccess,
        onError
    });
}


export const useRefreshToken = () => {

    const { setAuthData, setForceLogin } = useAuthStore();
    const refreshToken = localStorage.getItem("refreshToken");

    const onSuccess = (data, variables, context) => {
        console.log("access token refresh was success");
        setAuthData({ message: "", accessToken: data, refreshToken, userId: "" })
        setForceLogin(false);
    }

    const onError = (error, variables, context) => {
        setForceLogin(true);
        setAuthState("login");
        console.log("error on fetching access token: ", error);
    }

    return useMutation({
        mutationFn: async () => {
            console.log("useRefreshToken was called")
            const response = await fetchAccessToken(refreshToken);
            return await response.json();
        },
        onSuccess,
        onError,
        staleTime: false,
        refetchInterval: 540000,
        gcTime: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        select: (data) => data.accessToken
    });
}

export const useActivation = () => {

    const onSuccess = (data, variables, context) => {
        console.log("account activation success")
    }

    const onError = (error, variables, context) => {
        console.log("error on account activation:", error.message)
    }

    return useMutation({
        mutationFn: async (code) => {
            const response = await fetchActivation(code);
            return await response.json();
        },
        onSuccess,
        onError
    });
}
