import { PinInput, Text } from "@mantine/core";
import BoxStyled from "@shared/BoxStyled";
import GradientButton from "@shared/buttons/GradientButton";
import OutlineButton from "@shared/buttons/OutlineButton";
import FormStyled from "@shared/FormStyled";
import Typography from "@shared/Typography";
import React from "react";
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
            <Typography type="h2">Account Activation</Typography>
            <Typography size="md">{"enter code sent to your email: "}</Typography>
            <Typography size="md">{authState.formData.email}</Typography>
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
            <Typography size="md">haven't received a code?</Typography>
            <OutlineButton onClick={handleResendCode} name="resend code" />
        </BoxStyled>
    );
};

export default ActivationForm;