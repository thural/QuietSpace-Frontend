import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./zustand";
import { LOGIN_URL, SIGNUP_URL } from "../constants/ApiPath";
import { fetchLogin, fetchSignup } from "../api/authRequests";

export const usePostLogin = () => {

    const queryClient = useQueryClient();
    const { setAuthData, setForceLogin } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        console.log("login response from backend was success");
        queryClient.invalidateQueries(["posts", "user", "chats"]);
        queryClient.setQueryData("auth", data);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setAuthData(data);
        setForceLogin(false);
    }

    const onError = (error, variables, context) => {
        console.log("error on login:", error.message);
    }

    return useMutation({
        mutationFn: async (formData) => {
            const response = await fetchLogin(LOGIN_URL, formData);
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
        select: (data) => data.content
    });
}

export const usePostLogout = () => {

    const queryClient = useQueryClient();
    const { setAuthData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["posts", "user", "chat"]);
        queryClient.resetQueries("auth");
        console.log("user logout was success");
        localStorage.removeItem("accessToken");
        localStorage.setItem("refreshToken");
        setAuthData({ message: "", accessToken: "", userId: "" });
    }

    const onError = (error, variables, context) => {
        console.log("error on logout:", error.message);
        setAuthData({ message: "", accessToken: "", userId: "" });
    }

    return useMutation({
        mutationFn: async () => {
            const response = await fetchLogout(LOGOUT_URL, auth["accessToken"]);
            return await response.json();
        },
        onSuccess,
        onError
    });
}

export const usePostSignup = () => {

    const queryClient = useQueryClient();
    const { setAuthData } = useAuthStore();

    const onSuccess = (data, variables, context) => {
        queryClient.invalidateQueries(["posts", "user", "chats"]);
        queryClient.setQueryData("auth", data);
        setAuthData(data);
    }

    const onError = (error, variables, context) => {
        console.log("error on signup:", error.message)
    }

    return useMutation({
        mutationFn: async (formData) => {
            const response = await fetchSignup(SIGNUP_URL, formData);
            return await response.json();
        },
        onSuccess,
        onError
    });
}