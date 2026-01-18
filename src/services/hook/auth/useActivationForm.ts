import { fetchResendCode } from "@/api/requests/authRequests";
import { ActivationFormProps, AuthPages } from "@/types/authTypes";
import { useState } from "react";
import { useTimer } from "../common/useTimer";
import useJwtAuth from "./useJwtAuth";

export const useActivationForm = ({ setAuthState, authState }: ActivationFormProps) => {

    const activationNotice = (message: string) => alert(message);
    const [formData, setFormData] = useState({ activationCode: "" });
    const tokenTimer = useTimer(15 * 60 * 1000);

    const onSuccessFn = () => {
        console.log("account activation success");
        activationNotice("account has been activated, please login to continue");
        setAuthState({ ...authState, page: AuthPages.LOGIN });
    }

    const onErrorFn = (error: Error) => {
        console.log("error on account activation:", error.message);
    }

    const { activate } = useJwtAuth({ onSuccessFn, onErrorFn });

    const handleResendCode = (): void => {
        fetchResendCode(authState.formData.email);
        tokenTimer.resetTimer();
    };

    const handleSubmit = async (event: Event): Promise<void> => {
        event.preventDefault();
        activate(formData.activationCode);
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