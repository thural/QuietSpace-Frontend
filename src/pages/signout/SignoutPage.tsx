import FullLoadingOverlay from "@components/shared/FullLoadingOverlay";
import Typography from "@components/shared/Typography";
import { useSignout } from "./hooks/useSignout";


const SignoutPage = () => {

    const { isLoading, isError, error } = useSignout();

    if (isError) return <Typography type="h1">{`error in signout! 🔥 error: ${error}`}</Typography>
    if (isLoading) return <FullLoadingOverlay />;
}

export default SignoutPage