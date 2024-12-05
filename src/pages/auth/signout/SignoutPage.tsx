import LoaderStyled from "@/components/shared/LoaderStyled";
import { useAuthStore } from "@/services/store/zustand";
import Typography from "@components/shared/Typography";
import { useSignout } from "./hooks/useSignout";


const SignoutPage = () => {

    const { setIsAuthenticated } = useAuthStore();
    setIsAuthenticated(false);


    const { isLoading, isError, error } = useSignout(); // TODO: adjust routing to disable Navbar on signout

    if (isLoading) return <LoaderStyled />;
    if (isError) return <Typography type="h1">{`error in signout! 🔥 error: ${error}`}</Typography>;
}

export default SignoutPage