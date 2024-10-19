import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import Typography from "@components/shared/Typography";
import useJwtAuth from "@hooks/useJwtAuth";
import { useAuthStore } from "@hooks/zustand";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


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

    useEffect(signout, []);


    if (isError) return <Typography type="h1">{`error in signout! 🔥 error: ${error}`}</Typography>
    if (isLoading) return <FullLoadingOverlay />;
}

export default SignoutPage