import BoxStyled from "@components/shared/BoxStyled";
import GradientButton from "@components/shared/buttons/GradientButton";
import OutlineButton from "@components/shared/buttons/OutlineButton";
import FormStyled from "@components/shared/FormStyled";
import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import PassInput from "@components/shared/PassInput";
import TextInput from "@components/shared/TextInput";
import Typography from "@components/shared/Typography";
import { useLoginForm } from "./hooks/useLoginForm";
import styles from "../registration/styles/formStyles";
import { AuthFormProps } from "@/types/authTypes";

const LoginForm: React.FC<AuthFormProps> = ({ setAuthState, authState }) => {

    const classes = styles();

    const {
        formData,
        isAuthenticating,
        isError,
        error,
        handleLoginForm,
        handleFormChange,
        handleSignupBtn,
    } = useLoginForm({ setAuthState, authState });

    if (isAuthenticating) return <FullLoadingOverlay />;
    if (isError) return <Typography type="h1">{`could not authenticate! 🔥 error: ${error}`}</Typography>;

    return (
        <BoxStyled className={classes.wrapper}>
            <Typography type="h2">login</Typography>
            <FormStyled>
                <BoxStyled className="input-box">
                    <TextInput name='email' value={formData.email} handleChange={handleFormChange} />
                    <PassInput name='password' value={formData.password} handleChange={handleFormChange} />
                </BoxStyled>
                <GradientButton onClick={handleLoginForm} />
            </FormStyled>
            <Typography className="prompt">don't have an account?</Typography>
            <OutlineButton name="signup" onClick={handleSignupBtn} />
        </BoxStyled>
    );
};

export default LoginForm;