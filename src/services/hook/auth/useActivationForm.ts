import { fetchResendCode } from "@/api/requests/authRequests";
import { AuthPages } from "@/types/authTypes";
import { useState } from "react";
import { useAuthStore } from "@/services/store/zustand";
import { useTimer } from "../common/useTimer";
import useJwtAuth from "./useJwtAuth";

export const useActivationForm = () => {
    const { formData, setCurrentPage } = useAuthStore();

    const activationNotice = (message: string) => alert(message);
    const [activationCode, setActivationCode] = useState("");
    const tokenTimer = useTimer(15 * 60 * 1000);

    const onSuccessFn = () => {
        console.log("account activation success");
        activationNotice("account has been activated, please login to continue");
        setCurrentPage(AuthPages.LOGIN);
    }

    const onErrorFn = (error: Error) => {
        console.log("error on account activation:", error.message);
    }

    const { activate } = useJwtAuth();

    const handleActivate = async (code: string) => {
        try {
            await activate(code);
            onSuccessFn();
        } catch (error) {
            onErrorFn(error instanceof Error ? error : new Error(String(error)));
        }
    };

    const handleResendCode = (): void => {
        fetchResendCode(formData.email || '');
        tokenTimer.resetTimer();
    };

    const handleSubmit = async (event: Event): Promise<void> => {
        event.preventDefault();
        handleActivate(activationCode);
    };

    const handleChange = (value: string): void => {
        setActivationCode(value);
    };

    return {
        formData: { ...formData, activationCode },
        tokenTimer,
        handleSubmit,
        handleChange,
        handleResendCode,
    }
};