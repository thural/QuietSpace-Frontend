import { useActivation } from "@/services/data/useAuthData";
import { displayCountdown } from "@/services/hook/common/useTimer";
import { fetchResendCode } from "@/api/requests/authRequests";
import { useState } from "react";
import { ActivationFormProps, AuthPages } from "@/types/authTypes";

export const useActivationForm = ({ setAuthState, authState }: ActivationFormProps) => {

    const activationNotice = (message: string) => alert(message);
    const [formData, setFormData] = useState({ activationCode: "" });
    const tokenTimer = displayCountdown(15 * 60 * 1000, "code has expired");

    const onSuccess = () => {
        console.log("account activation success");
        activationNotice("account has been activated, please login to continue");
        setAuthState({ ...authState, page: AuthPages.LOGIN });
    }

    const onError = (error: Error) => {
        console.log("error on account activation:", error.message);
    }

    const activation = useActivation(onSuccess, onError);

    const handleResendCode = (): void => {
        fetchResendCode(authState.formData.email);
        tokenTimer.resetTimer();
    };

    const handleSubmit = async (event: Event): Promise<void> => {
        event.preventDefault();
        activation.mutate(formData.activationCode);
    };

    const handleChange = (value: string): void => {
        setFormData({ ...formData, activationCode: value });
    };

    return {
        formData,
        tokenTimer,
        authState,
        handleResendCode,
        handleSubmit,
        handleChange,
    }
};