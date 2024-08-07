import React, { useEffect, useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import useJwtAuth from "../../hooks/useJwtAuth";
import { useAuthStore } from "../../hooks/zustand";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";


const SignoutPage = () => {

    const { setAuthData, resetAuthData, setIsAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);


    const onLoadFn = () => {
        setIsLoading(true);
    }

    const onSuccessFn = (data) => {
        queryClient.clear();
        setIsLoading(false);
        const refreshToken = localStorage.getItem("refreshToken");
        setAuthData({ message: "", accessToken: "", refreshToken, userId: "" });
        setIsAuthenticated(false);
        navigate("/");
    }

    const onErrorFn = (error) => {
        setIsLoading(false);
        resetAuthData();
        setError(error);
        setIsError(true);
    }


    const { signout } = useJwtAuth({ onSuccessFn, onErrorFn, onLoadFn });
    useEffect(signout, [])


    if (isError) return <h1>{`error in signout! 🔥 error: ${error}`}</h1>
    if (isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
}

export default SignoutPage