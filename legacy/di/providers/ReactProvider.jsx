/**
 * React DI Provider
 * 
 * React context provider for dependency injection.
 * Integrates DI container with React component tree.
 */

import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';

// Create React context for DI container
const DIContext = createContext(null);

/**
 * Props for DI Provider component
 */
export const DIProvider = ({ children, container }) => {
    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        container,
        // Convenience methods for common operations
        get: (token) => container.get(token),
        getByToken: (token) => container.getByToken(token),
        resolve: (token) => container.resolve(token)
    }), [container]);

    return (
        <DIContext.Provider value={contextValue}>
            {children}
        </DIContext.Provider>
    );
};

/**
 * Hook to access DI container from React components
 */
export const useDI = () => {
    const context = useContext(DIContext);
    
    if (!context) {
        throw new Error('useDI must be used within a DIProvider');
    }
    
    return context;
};

/**
 * Hook to get a specific service from DI container
 */
export const useService = (token) => {
    const { getByToken } = useDI();
    return getByToken(token);
};

/**
 * Higher-order component to inject dependencies
 */
export const withDI = (Component, dependencies = {}) => {
    return (props) => {
        const di = useDI();
        
        // Resolve dependencies and inject them as props
        const injectedProps = {};
        for (const [propName, token] of Object.entries(dependencies)) {
            injectedProps[propName] = di.getByToken(token);
        }
        
        return <Component {...props} {...injectedProps} />;
    };
};

export default DIProvider;
