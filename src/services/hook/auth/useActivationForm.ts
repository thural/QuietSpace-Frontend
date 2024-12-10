import { fetchResendCode } from "@/api/requests/authRequests";
import { displayCountdown } from "@/services/hook/common/useTimer";
import { ActivationFormProps, AuthPages } from "@/types/authTypes";
import { useState } from "react";
import useJwtAuth from "./useJwtAuth";

export const useActivationForm = ({ setAuthState, authState }: ActivationFormProps) => {

    const activationNotice = (message: string) => alert(message);
    const [formData, setFormData] = useState({ activationCode: "" });
    const tokenTimer = displayCountdown(15 * 60 * 1000, "code has expired");

    const onSuccessFn = () => {
        console.log("account activation success");
        activationNotice("account has been activated, please login to continue");
        setAuthState({ ...authState, page: AuthPages.LOGIN });
    }

    const onErrorFn = (error: Error) => {
        console.log("error on account activation:", error.message);
    }

    const { acitvate } = useJwtAuth({ onSuccessFn, onErrorFn });

    const handleResendCode = (): void => {
        fetchResendCode(authState.formData.email);
        tokenTimer.resetTimer();
    };

    const handleSubmit = async (event: Event): Promise<void> => {
        event.preventDefault();
        acitvate(formData.activationCode);
    };

    const handleChange = (value: string): void => {
        setFormData({ ...formData, activationCode: value });
    };

    return {
        formData,
        tokenTimer,
        authState,
        handleSubmit,
        handleChange,
        handleResendCode,
    }
};