import { useState } from "react";
import styles from "./styles/activationPageStyles";
import { Button, Text, Title } from "@mantine/core";
import { useActivation, usePostLogin } from "../../hooks/useAuthData";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchResendCode } from "../../api/authRequests";


const ActivationPage = ({ setAuthState }) => {

    const [formData, setFormData] = useState({ activationCode: "" });
    const navigate = useNavigate();
    const activation = useActivation();
    const { state } = useLocation();

    if (activation.isSuccess) navigate("/signin");

    const handleResendCode = () => {
        fetchResendCode(state.email);
    }

    const handleSubmit = async (event) => {
        console.log("form data on login submit: ", formData);
        event.preventDefault();
        activation.mutate(formData.activationCode);
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }


    const classes = styles();


    return (
        <>
            <div className={classes.login}>
                <Title order={2}>Account Activation</Title>
                <Title order={3}>{"activation code has been sent your email: " + state.email}</Title>
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

export default ActivationPage