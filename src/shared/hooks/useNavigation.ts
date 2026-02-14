import { useState } from 'react';
import { createNavigationHookService } from './NavigationHookService';

/**
 * Enterprise useNavigation hook
 * 
 * Now uses the NavigationHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
 *
 * @returns {{
 *     navigatePath: (path: string) => void,     // Function to navigate to a path.
 * }} - An object containing navigation utilities.
 */
const useNavigation = () => {
    const [service] = useState(() => createNavigationHookService());

    return service.getNavigationUtilities();
};

export default useNavigation;