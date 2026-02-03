import { fetchResendCode } from "@features/auth/data/authRequests";
import { AuthPages } from "@/features/auth/types/auth.ui.types";
import { useState } from "react";
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import { useTimer } from "./useTimer";
import { useEnterpriseAuth } from "@/core/modules/authentication";

export const useActivationForm = () => {
    // Using local state instead of auth store for form management
    const [currentPage, setCurrentPage] = useState(AuthPages.LOGIN);
    const [formData, setFormData] = useState({ email: '', activationCode: '' });

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

    const { activate } = useEnterpriseAuth();

    const handleActivate = async (code: string) => {
        try {
            await activate(code);
            onSuccessFn();
        } catch (error) {
            onErrorFn(error instanceof Error ? error : new Error(String(error)));
        }
    };

    const handleResendCode = async (): Promise<void> => {
        try {
            await fetchResendCode(formData.email || '');
            tokenTimer.resetTimer();
            activationNotice("Activation code resent successfully");
        } catch (error) {
            console.error("Failed to resend activation code:", error);
            activationNotice("Failed to resend activation code. Please try again.");
        }
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