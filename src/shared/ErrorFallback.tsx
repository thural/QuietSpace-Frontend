import React from 'react';
import BoxStyled from '@/shared/BoxStyled';
import Typography from '@/shared/Typography';
import OutlineButton from '@/shared/buttons/OutlineButton';

interface ErrorFallbackProps {
    error?: string;
    onRetry?: () => void;
}

/**
 * ErrorFallback component for displaying user-friendly error messages
 * 
 * Provides clear error feedback with retry option for better user experience.
 * Used when authentication or user data loading fails.
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
    error = 'An error occurred', 
    onRetry 
}) => {
    const handleRetry = () => {
        // Reload the page to retry authentication
        window.location.reload();
    };

    return (
        <BoxStyled className="flex items-center justify-center min-h-screen bg-gray-50">
            <BoxStyled className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <BoxStyled className="text-center">
                    {/* Error Icon */}
                    <BoxStyled className="mb-4">
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
                    </BoxStyled>

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
                    <BoxStyled className="space-y-3">
                        <OutlineButton 
                            name="Try Again"
                            onClick={onRetry || handleRetry}
                            className="w-full"
                        />
                        
                        <OutlineButton 
                            name="Go to Sign In"
                            onClick={() => window.location.href = '/signin'}
                            className="w-full"
                        />
                    </BoxStyled>
                </BoxStyled>
            </BoxStyled>
        </BoxStyled>
    );
};

export default ErrorFallback;
