import { useNavigate } from "react-router-dom";
import { Container } from '@/shared/ui/components/layout/Container';
import { FlexContainer } from '@/shared/ui/components/layout/FlexContainer';
import Typography from "@/shared/ui/components/typography/Text";
import OutlineButton from "@/shared/ui/buttons/OutlineButton";

/**
 * Unauthorized page for users without proper permissions.
 */
const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <Container className="flex flex-col items-center justify-center min-h-screen p-8">
            <Typography type="h1" className="text-6xl font-bold text-red-500 mb-4">
                403
            </Typography>
            <Typography type="h2" className="text-2xl font-semibold mb-4">
                Access Denied
            </Typography>
            <Typography size="lg" className="text-gray-600 text-center mb-8">
                You don't have permission to access this page.
            </Typography>

            <FlexContainer className="gap-4">
                <OutlineButton name="Go Back" onClick={handleGoBack} />
                <OutlineButton name="Go Home" onClick={handleGoHome} />
            </FlexContainer>
        </Container>
    );
};

export default UnauthorizedPage;
