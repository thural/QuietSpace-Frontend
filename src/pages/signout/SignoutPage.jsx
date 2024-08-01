import React from "react";
import { unloadTokens } from "../../hooks/useToken";
import { useAuthStore } from "../../hooks/zustand";
import { redirect } from "react-router-dom";
import { LoadingOverlay } from "@mantine/core";

const SignoutPage = () => {

    const {isSuccess, isLoading, isError, error} = unloadTokens();
    const {setForceLogin, resetAuthData} = useAuthStore();

    console.log("isSuccess: ", isSuccess)

    if(isSuccess) {
        resetAuthData();
        redirect("/signin");
        setForceLogin(true);
    }
    
    if(isError) return <Text>{"error at signin out: " + error}</Text>
    if(isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
}

export default SignoutPage