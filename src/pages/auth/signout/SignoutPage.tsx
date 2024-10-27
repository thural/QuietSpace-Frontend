import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import Typography from "@components/shared/Typography";
import { useSignout } from "./hooks/useSignout";
import { useAuthStore } from "@/services/store/zustand";


const SignoutPage = () => {

    const { setIsAuthenticated } = useAuthStore();
    setIsAuthenticated(false);


    const { isLoading, isError, error } = useSignout(); // TODO: adjust routing to disable Navbar on signout

    if (isError) return <Typography type="h1">{`error in signout! 🔥 error: ${error}`}</Typography>
    if (isLoading) return <FullLoadingOverlay />;
}

export default SignoutPage