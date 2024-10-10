import { useState } from "react";
import { useActivation } from "../../../hooks/useAuthData";
import { fetchResendCode } from "../../../api/authRequests";
import { displayCountdown } from "../../../hooks/useTimer";

export const useActivationForm = (setAuthState, authState) => {
    const activationNotice = (message) => alert(message);
    const [formData, setFormData] = useState({ activationCode: "" });
    const tokenTimer = displayCountdown(15 * 60 * 1000, "code has expired");
    const activation = useActivation(authState, setAuthState, activationNotice);

    const handleResendCode = () => {
        fetchResendCode(authState.formData.email);
        tokenTimer.resetTimer(16 * 60 * 1000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        activation.mutate(formData.activationCode);
    };

    const handleChange = (value) => {
        setFormData({ ...formData, activationCode: value });
    };

    return {
        formData,
        tokenTimer,
        authState,
        handleResendCode,
        handleSubmit,
        handleChange,
    };
};