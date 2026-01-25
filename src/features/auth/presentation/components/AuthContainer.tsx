import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { Container } from "@/shared/ui/components/layout/Container";
import { Text } from "@/shared/ui/components/typography/Text";
import { Title } from "@/shared/ui/components/typography/Title";
import { AuthContainer as StyledAuthContainer, FormContainer } from "@auth/presentation/styles/AuthStyles";
import { useLocation } from "react-router-dom";
import ActivationForm from "./ActivationForm";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { SecurityMonitor } from "./SecurityMonitor";


/**
 * AuthContainer component manages authentication forms (Login, Signup, Activation).
 * Uses global auth store for centralized state management.
 *
 * @returns {JSX.Element} - The rendered authentication container.
 */
const AuthContainer = () => {
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
        <StyledAuthContainer>
            <Container className="greeting-text">
                <Title className="brand" variant="h1" size="4rem">QuietSpace</Title>
                <Text className="primary-text" size="1.5rem">social media without distraction</Text>
                <Text className="secondary-text">where free speech and privacy is the priority</Text>
            </Container>
            <RenderResult />

            {/* Security Monitor - Admin Only */}
            {process.env.NODE_ENV === 'development' && (
                <Container className="security-monitor-section" style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
                    <SecurityMonitor />
                </Container>
            )}
        </StyledAuthContainer>
    );
}

export default withErrorBoundary(AuthContainer);