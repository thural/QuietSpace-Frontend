import { fetchAccessToken, fetchActivation, fetchLogin, fetchSignup } from "../api/authRequests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./zustand";

export const usePostLogin = (authenticationNotice) => {

    const { setAuthData } = useAuthStore();
    const navigate = useNavigate();

    const onSuccess = (data, variables, context) => {
        console.log("login response from backend was success");
        localStorage.setItem("refreshToken", data.refreshToken);
        setAuthData(data);
        navigate("/");
    }

    const onError = (error, variables, context) => {
        console.log("error on login:", error.message);
        authenticationNotice("failed to authenticate, eror: ", error.message);
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
    const { resetAuthData } = useAuthStore();

    queryClient.removeQueries();

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

export const usePostSignup = (setAuthState) => {

    const onSuccess = (data, variables, context) => {
        console.log("signup was success");
        console.log("useSignup context on success: ", variables);
        setAuthState({ page: "activation", formData: variables });
    }

    const onError = (error, variables, context) => {
        console.log("email in useSignup context on error: ", variables);
        console.log("error on signup:", error.message);
    }

    return useMutation({
        mutationKey: "signupMutation",
        mutationFn: async (formData) => {
            console.log("form data on signup mutation: ", formData);
            await fetchSignup(formData);
        },
        onSuccess,
        onError
    });
}


export const useRefreshToken = () => {

    const { setAuthData } = useAuthStore();
    const refreshToken = localStorage.getItem("refreshToken");

    const onSuccess = (data, variables, context) => {
        console.log("access token refresh was success");
        setAuthData({ message: "", accessToken: data, refreshToken, userId: "" })
    }

    const onError = (error, variables, context) => {
        setAuthState("login");
        console.log("error on fetching access token: ", error);
    }

    return useMutation({
        mutationFn: async () => {
            console.log("useRefreshToken was called");
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

export const useActivation = (authState, setAuthState, activationNotice) => {

    const onSuccess = (data, variables, context) => {
        console.log("account activation success");
        activationNotice("account has been activated, please login to continue");
        setAuthState({ ...authState, page: "login" });
    }

    const onError = (error, variables, context) => {
        console.log("error on account activation:", error.message);
    }

    return useMutation({
        mutationFn: async (code) => {
            await fetchActivation(code);
        },
        onSuccess,
        onError
    });
}
