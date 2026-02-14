import { getNavigationService } from '../services/NavigationService';

/**
 * Enterprise useNavigation hook
 * 
 * Now uses NavigationService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise patterns.
 *
 * @returns {{
 *     navigatePath: (path: string) => void,     // Function to navigate to a path.
 * }} - An object containing navigation utilities.
 */
const useNavigation = () => {
    const service = getNavigationService();

    const navigatePath = (path: string) => {
        service.navigatePath(path);
    };

    return { navigatePath }
};

export default useNavigation;