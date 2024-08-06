import React, { useEffect, useState } from "react";
import { LoadingOverlay, Text } from "@mantine/core";
import useJwtAuth from "../../hooks/useJwtAuth";
import { useAuthStore } from "../../hooks/zustand";
import { useNavigate } from "react-router-dom";

const SignoutPage = () => {
    const { setAuthData, resetAuthData, setIsAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);


    const onLoadFn = () => {
        setIsLoading(true);
    }

    const onSuccessFn = (data) => {
        setIsLoading(false);
        const refreshToken = localStorage.getItem("refreshToken");
        resetAuthData();
        setAuthData({ message: "", accessToken: "", refreshToken, userId: "" });
        console.log("auth data has been set");
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