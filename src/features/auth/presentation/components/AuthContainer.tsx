import { BaseClassComponent, IBaseComponentProps } from "@/shared/components/base/BaseClassComponent";
import { Container } from "@/shared/ui/components/layout/Container";
import { Text } from "@/shared/ui/components/typography/Text";
import { Title } from "@/shared/ui/components/typography/Title";
import { AuthContainer as StyledAuthContainer } from "../styles/AuthStyles";
import withErrorBoundary from "@/shared/hooks/withErrorBoundary";
import { ReactNode } from "react";
import ActivationForm from "./ActivationForm";
import LoginForm from "./LoginForm";
import { SecurityMonitor } from "./SecurityMonitor";
import SignupForm from "./SignupForm";

/**
 * Props for AuthContainer component
 */
interface IAuthContainerProps extends IBaseComponentProps {
    // No additional props needed
}

/**
 * State for AuthContainer component
 */
interface IAuthContainerState {
    currentPath: string;
    location: any;
}

/**
 * AuthContainer component manages authentication forms (Login, Signup, Activation).
 * Uses global auth store for centralized state management.
 * 
 * Converted to class-based component following enterprise patterns with proper state management
 * and lifecycle handling.
 */
class AuthContainer extends BaseClassComponent<IAuthContainerProps, IAuthContainerState> {

    protected override getInitialState(): Partial<IAuthContainerState> {
        return {
            currentPath: '',
            location: null
        };
    }

    protected override onMount(): void {
        super.onMount();
        this.initializeLocation();
    }

    protected override onUpdate(_prevProps: IAuthContainerProps, prevState: IAuthContainerState): void {
        // Handle location changes
        const currentLocation = this.getLocation();
        if (currentLocation !== prevState.location) {
            this.safeSetState({
                location: currentLocation,
                currentPath: this.getCurrentPath(currentLocation)
            });
        }
    }

    private initializeLocation(): void {
        const location = this.getLocation();
        this.safeSetState({
            location,
            currentPath: this.getCurrentPath(location)
        });
    }

    private getLocation(): any {
        // In a real implementation, this would get the location from router context
        // For now, we'll simulate it
        return {
            pathname: window.location.pathname
        };
    }

    private getCurrentPath(location: any): string {
        if (!location) return '';

        // Split the path by "/" and take the last segment
        const segments = location.pathname.split("/");
        return segments.pop() || ""; // fallback if empty
    }

    private renderForm(): ReactNode {
        const { currentPath } = this.state;

        switch (currentPath) {
            case "signup":
                return <SignupForm />;
            case "login":
                return <LoginForm />;
            case "activation":
                return <ActivationForm />;
            default:
                return null;
        }
    }

    protected override renderContent(): ReactNode {
        return (
            <StyledAuthContainer>
                <Container className="greeting-text">
                    <Title className="brand" variant="h1" size="4rem">QuietSpace</Title>
                    <Text className="primary-text" size="1.5rem">social media without distraction</Text>
                    <Text className="secondary-text">where free speech and privacy is the priority</Text>
                </Container>
                {this.renderForm()}

                {/* Security Monitor - Admin Only */}
                {process.env.NODE_ENV === 'development' && (
                    <Container className="security-monitor-section" style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
                        <SecurityMonitor />
                    </Container>
                )}
            </StyledAuthContainer>
        );
    }
}

export default withErrorBoundary(AuthContainer);