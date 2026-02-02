import { getErrorBoundaryService } from '../services/ErrorBoundaryService';

/**
 * Enterprise withErrorBoundary hook
 * 
 * Now uses the ErrorBoundaryService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise patterns.
 *
 * @param {React.ComponentType<P>} Component - The component to be wrapped with the error boundary.
 * @returns {React.FC<P>} - A new component that includes error boundary functionality.
 */
const withErrorBoundary = <P extends object>(Component: React.ComponentType<P>): React.ComponentType<P> => {
    const service = getErrorBoundaryService();
    return service.wrapComponent(Component);
};

export default withErrorBoundary;