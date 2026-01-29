import React, { PureComponent, ReactNode } from 'react';
import { Container } from '@/shared/ui/components/layout/Container';
import Typography from '@/shared/ui/components/utility/Typography';
import OutlineButton from '@/shared/ui/buttons/OutlineButton';

interface IErrorFallbackProps {
    error?: string;
    onRetry?: () => void;
}

/**
 * ErrorFallback component for displaying user-friendly error messages
 * 
 * Provides clear error feedback with retry option for better user experience.
 * Used when authentication or user data loading fails.
 */
class ErrorFallback extends PureComponent<IErrorFallbackProps> {
    static defaultProps: Partial<IErrorFallbackProps> = {
        error: 'An error occurred'
    };

    // Default retry handler - reloads the page
    private handleRetry = (): void => {
        window.location.reload();
    };

    // Navigate to sign-in page
    private handleGoToSignIn = (): void => {
        window.location.href = '/signin';
    };

    // Render error icon SVG
    private renderErrorIcon = (): ReactNode => {
        return (
            <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.159L13.562 9.17c-.406-1.492-1.749-2.583-3.159-2.583H6.597c-1.41 0-2.753 1.091-3.159 2.583L2.582 16.841C2.582 18.333 3.542 20 5.082 20h13.836c1.54 0 2.502-1.667 2.502-3.159L18.418 9.17c-.406-1.492-1.749-2.583-3.159-2.583z"
                />
            </svg>
        );
    };

    // Render action buttons
    private renderActionButtons = (): ReactNode => {
        const { onRetry } = this.props;

        return (
            <Container className="space-y-3">
                <OutlineButton
                    name="Try Again"
                    onClick={onRetry || this.handleRetry}
                    className="w-full"
                />

                <OutlineButton
                    name="Go to Sign In"
                    onClick={this.handleGoToSignIn}
                    className="w-full"
                />
            </Container>
        );
    };

    render(): ReactNode {
        const { error } = this.props;

        return (
            <Container className="flex items-center justify-center min-h-screen bg-gray-50">
                <Container className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                    <Container className="text-center">
                        {/* Error Icon */}
                        <Container className="mb-4">
                            {this.renderErrorIcon()}
                        </Container>

                        {/* Error Message */}
                        <Typography
                            type="h3"
                            className="text-xl font-semibold text-gray-900 mb-2"
                        >
                            Authentication Error
                        </Typography>

                        <Typography
                            size="md"
                            className="text-gray-600 mb-6"
                        >
                            {error}
                        </Typography>

                        {/* Action Buttons */}
                        {this.renderActionButtons()}
                    </Container>
                </Container>
            </Container>
        );
    }
}

export default ErrorFallback;
