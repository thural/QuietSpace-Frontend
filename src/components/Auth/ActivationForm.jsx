import { PinInput, Text, Title } from "@mantine/core";
import React from "react";
import FillGradientBtn from "../Shared/FillGradientBtn";
import FillOutlineBtn from "../Shared/FillOutlineBtn";
import { useActivationForm } from "./hooks/useActivationForm";
import styles from "./styles/activationFormStyles";

const Timer = ({ tokenTimer }) => (
    <div className="timer">
        {!tokenTimer.hasTimeOut ? <Text>{"code will be expired in:"}</Text>
            : <Text>{"code has expired, get a new code"}</Text>}
        {!tokenTimer.hasTimeOut && tokenTimer.component}
    </div>
);

const ActivationForm = ({ setAuthState, authState }) => {

    const classes = styles();

    const {
        formData,
        tokenTimer,
        handleResendCode,
        handleSubmit,
        handleChange,
    } = useActivationForm(setAuthState, authState);

    return (
        <div className={classes.activation}>
            <Title order={2}>Account Activation</Title>
            <Text size="md">{"enter code sent to your email: "}</Text>
            <Text size="md">{authState.formData.email}</Text>
            <form className='activation-form'>
                <PinInput
                    length={6}
                    name="activationCode"
                    type="number"
                    value={formData.activationCode}
                    onChange={handleChange}
                />
                <Timer tokenTimer={tokenTimer} />
                <FillGradientBtn onClick={handleSubmit} />
            </form>
            <Text size="md">haven't received a code?</Text>
            <FillOutlineBtn onClick={handleResendCode} name="resend code" />
        </div>
    );
};

export default ActivationForm;