import React, { createContext, useContext, useState } from 'react';
import { createNavigationHookService } from './NavigationHookService';

/**
 * Navigation context for direct service integration
 */
const NavigationContext = createContext<ReturnType<typeof createNavigationHookService> | null>(null);

/**
 * Navigation provider component that directly integrates with NavigationHookService
 */
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [service] = useState(() => createNavigationHookService());

    return React.createElement(
        NavigationContext.Provider,
        { value: service },
        children
    );
};

/**
 * Enterprise useNavigation hook with direct service integration
 * 
 * Optimized to use NavigationHookService directly through context for better performance
 * and cleaner architecture while maintaining backward compatibility.
 *
 * @returns {{
 *     navigatePath: (path: string) => void,     // Function to navigate to a path.
 * }} - An object containing navigation utilities.
 */
const useNavigation = () => {
    const service = useContext(NavigationContext);

    if (!service) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }

    return service.getNavigationUtilities();
};

export default useNavigation;