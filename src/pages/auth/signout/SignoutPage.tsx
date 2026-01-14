import LoaderStyled from "@/shared/LoaderStyled";
import { useAuthStore } from "@/services/store/zustand";
import Typography from "@/shared/Typography";
import { useSignout } from "./hooks/useSignout";

/**
 * SignoutPage component.
 * 
 * This component manages the user sign-out process. It communicates
 * with the authentication store to update the user's authentication state,
 * triggers the sign-out functionality, and displays appropriate loading
 * or error messages.
 * 
 * @returns {JSX.Element | null} - The rendered component, which may include a loader,
 *                                  an error message, or null if no user is signed in.
 */
const SignoutPage = () => {
    const { setIsAuthenticated } = useAuthStore();
    setIsAuthenticated(false); // Update authentication state to false

    const { isLoading, isError, error } = useSignout(); // Hook to handle sign-out process

    // Show loader while the sign-out process is in progress
    if (isLoading) return <LoaderStyled />;

    // Show error message if there was an error during sign-out
    if (isError) {
        return (
            <Typography type="h1">
                {`Error in signout! 🔥 Error: ${error}`}
            </Typography>
        );
    }

    return null; // Render nothing if sign-out is successful
}

export default SignoutPage;