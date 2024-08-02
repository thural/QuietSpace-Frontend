import React from "react";
import { unloadTokens } from "../../hooks/useToken";
import { LoadingOverlay } from "@mantine/core";

const SignoutPage = () => {

    const { isSuccess, isLoading, isError, error } = unloadTokens();

    if (isError) return <Text>{"error at signin out: " + error}</Text>
    if (isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
}

export default SignoutPage