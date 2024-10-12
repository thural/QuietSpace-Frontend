import { PinInput, Text, Title } from "@mantine/core";
import React from "react";
import BoxStyled from "../Shared/BoxStyled";
import GradientButton from "../Shared/buttons/GradientButton";
import OutlineButton from "../Shared/buttons/OutlineButton";
import FormStyled from "../Shared/Form";
import { useActivationForm } from "./hooks/useActivationForm";
import styles from "./styles/activationFormStyles";

const Timer = ({ tokenTimer }) => (
    <FormStyled className="timer">
        {!tokenTimer.hasTimeOut ? <Text>{"code will be expired in:"}</Text>
            : <Text>{"code has expired, get a new code"}</Text>}
        {!tokenTimer.hasTimeOut && tokenTimer.component}
    </FormStyled>
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
        <BoxStyled className={classes.activation}>
            <Title order={2}>Account Activation</Title>
            <Text size="md">{"enter code sent to your email: "}</Text>
            <Text size="md">{authState.formData.email}</Text>
            <FormStyled className='activation-form'>
                <PinInput
                    length={6}
                    name="activationCode"
                    type="number"
                    value={formData.activationCode}
                    onChange={handleChange}
                />
                <Timer tokenTimer={tokenTimer} />
                <GradientButton onClick={handleSubmit} />
            </FormStyled>
            <Text size="md">haven't received a code?</Text>
            <OutlineButton onClick={handleResendCode} name="resend code" />
        </BoxStyled>
    );
};

export default ActivationForm;