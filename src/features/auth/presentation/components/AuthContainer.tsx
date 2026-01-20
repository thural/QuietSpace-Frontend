import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import BoxStyled from "@/shared/BoxStyled";
import Typography from "@/shared/Typography";
import styles from "../styles/authStyles";
import { useLocation } from "react-router-dom";
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
    const location = useLocation();

    /**
     * Renders the appropriate authentication form based on the current path ending.
     *
     * @returns {JSX.Element | null} - The rendered form component based on currentPage.
     */

    // Split the path by "/" and take the last segment
    const segments = location.pathname.split("/");
    const lastSegment = segments.pop() || ""; // fallback if empty

    const RenderResult = () => {
        switch (lastSegment) {
            case "signup":
                return <SignupForm />;
            case "login":
                return <LoginForm />;
            case "activation":
                return <ActivationForm />;
            default:
                return null;
        }
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