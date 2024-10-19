import BoxStyled from "@shared/BoxStyled";
import GradientButton from "@shared/buttons/GradientButton";
import OutlineButton from "@shared/buttons/OutlineButton";
import FormStyled from "@shared/FormStyled";
import FullLoadingOverlay from "@shared/FullLoadingOverlay";
import PassInput from "@shared/PassInput";
import TextInput from "@shared/TextInput";
import Typography from "@shared/Typography";
import { useLoginForm } from "./hooks/useLoginForm";
import styles from "../registration/styles/formStyles";

const LoginForm = ({ setAuthState, authState }) => {

    const classes = styles();

    const {
        formData,
        isAuthenticating,
        isError,
        error,
        handleLoginForm,
        handleChange,
        handleSignupBtn,
    } = useLoginForm(setAuthState, authState);

    if (isAuthenticating) return <FullLoadingOverlay />;
    if (isError) return <Typography type="h1">{`could not authenticate! 🔥 error: ${error}`}</Typography>;

    return (
        <BoxStyled className={classes.wrapper}>
            <Typography type="h2">login</Typography>
            <FormStyled>
                <BoxStyled className="input-box">
                    <TextInput name='email' value={formData.email} handleChange={handleChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleChange} />
                </BoxStyled>
                <GradientButton onClick={handleLoginForm} />
            </FormStyled>
            <Typography className="prompt">don't have an account?</Typography>
            <OutlineButton name="signup" onClick={handleSignupBtn} />
        </BoxStyled>
    );
};

export default LoginForm;