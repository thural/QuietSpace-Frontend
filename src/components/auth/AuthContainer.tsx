import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/auth/authStyles";
import { AuthPages } from "@/types/authTypes";
import BoxStyled from "@/shared/BoxStyled";
import Typography from "@/shared/Typography";
import { useAuthStore } from "@/services/store/zustand";
import ActivationForm from "./ActivationForm";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

/**
 * AuthContainer component manages authentication forms (Login, Signup, Activation).
 * Uses global auth store for centralized state management.
 *
 * @returns {JSX.Element} - The rendered authentication container.
 */
const AuthContainer = () => {
    const classes = styles();
    const { currentPage, formData } = useAuthStore();

    /**
     * Renders the appropriate authentication form based on the current auth state.
     *
     * @returns {JSX.Element | null} - The rendered form component based on currentPage.
     */
    const RenderResult = () => {
        if (currentPage === AuthPages.SIGNUP)
            return <SignupForm />;
        if (currentPage === AuthPages.LOGIN)
            return <LoginForm />;
        if (currentPage === AuthPages.ACTIVATION)
            return <ActivationForm />;

        return null; // Return null if no valid page is matched
    };

    return (
        <BoxStyled className={classes.auth}>
            <BoxStyled className="greeting-text">
                <Typography className="brand" size="4rem" type="h1">QuietSpace</Typography>
                <Typography className="primary-text" size="1.5rem">social media without distraction</Typography>
                <Typography className="secondary-text">where free speech and privacy is the priority</Typography>
            </BoxStyled>
            <RenderResult />
        </BoxStyled>
    );
}

export default withErrorBoundary(AuthContainer);