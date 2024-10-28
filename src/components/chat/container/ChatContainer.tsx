import DefaultContainer from "@/components/shared/DefaultContainer";
import Typography from "@/components/shared/Typography";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import ChatSidebar from "../components/sidebar/panel/ChatSidebar"
import styles from "./styles/chatContainerStyles";
import { useGetChatsByUserId } from "@/services/data/useChatData";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/api/schemas/inferred/user";
import { nullishValidationdError } from "@/utils/errorUtils";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import withErrorBoundary from "@/components/shared/hooks/withErrorBoundary";
import ErrorComponent from "@/components/shared/error/ErrorComponent";

const ChatContainer: React.FC<GenericWrapper> = ({ children }) => {

    const classes = styles();

    let data = undefined;

    try {
        const queryClient = useQueryClient();
        const user: User | undefined = queryClient.getQueryData(["user"]);
        if (user === undefined) throw nullishValidationdError({ user });
        data = useGetChatsByUserId(user.id);
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `could not load chat data: ${(error as Error).message}`
        return <ErrorComponent message={errorMessage} />;
    }

    const { isLoading, isError } = data;


    if (isLoading) return <FullLoadingOverlay />;
    if (isError) return <Typography type="h1">{'(!) could not fetch chat data!'}</Typography>;


    return (
        <DefaultContainer className={classes.container}>
            <ChatSidebar className={classes.contacts} />
            {children}
        </DefaultContainer>
    )
}

export default withErrorBoundary(ChatContainer);