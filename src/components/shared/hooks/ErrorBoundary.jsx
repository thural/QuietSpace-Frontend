import { Center } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import Typography from '../Typography';

const ErrorBoundary = ({ children }) => {
    const [error, setError] = useState(null);

    const logError = (event) => {
        console.log('Error message:', event.message); // Error message
        console.log('Source:', event.filename); // URL of the script where the error occurred
        console.log('Line:', event.lineno); // Line number where the error occurred
        console.log('Column:', event.colno); // Column number where the error occurred
        console.log('Error object:', event.error); // Error object (if available)
    }

    useEffect(() => {
        const handleError = (event) => {
            setError(event);
            logError(event);
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    if (error !== null) {
        return (
            <Center>
                <Typography type="h1">Something went wrong: {error.message}</Typography>
            </Center>
        )
    }

    return children;
};

export default ErrorBoundary;
