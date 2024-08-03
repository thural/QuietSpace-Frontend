import styles from "./styles/activationFormStyles";
import { useState } from "react";
import { Button, PinInput, Text, Title } from "@mantine/core";
import { useActivation } from "../../hooks/useAuthData";
import { fetchResendCode } from "../../api/authRequests";


const ActivationForm = ({ setAuthState, authState }) => {

    const [formData, setFormData] = useState({ activationCode: "" });
    const activationNotice = (message) => alert(message);
    const activation = useActivation(authState, setAuthState, activationNotice);

    const handleResendCode = () => {
        console.log("email on activation state: ", authState.formData.email);
        fetchResendCode(authState.formData.email);
    }

    const handleSubmit = async (event) => {
        console.log("form data on activation submit: ", formData);
        event.preventDefault();
        activation.mutate(formData.activationCode);
    }

    const handleChange = (value) => {
        console.log("form data: ", formData);
        setFormData({ ...formData, activationCode: value });
    }


    const classes = styles();


    return (
        <>
            <div className={classes.login}>
                <Title order={2}>Account Activation</Title>
                <Title order={3}>{"activation code has been sent your email: " + authState.formData.email}</Title>
                <form className='activation form'>
                    <div className="otp-input">
                        <PinInput
                            length={6}
                            name="activationCode"
                            type="number"
                            value={formData.activationCode}
                            onChange={handleChange}
                        />
                    </div>
                    <Button
                        className="button"
                        fullWidth
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                        onClick={handleSubmit}>
                        submit
                    </Button>
                </form>
                <Text className="resend-prompt">have not received the code?</Text>
                <Button className="button" variant="outline" onClick={handleResendCode}>resend code</Button>
            </div>
        </>
    )
}

export default ActivationForm