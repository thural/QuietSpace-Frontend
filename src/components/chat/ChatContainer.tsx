import DefaultContainer from "@/components/shared/DefaultContainer";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import ChatSidebar from "./sidebar/ChatSidebar"
import styles from "@/styles/chat/chatContainerStyles";
import { useGetChats } from "@/services/data/useChatData";
import { nullishValidationdError } from "@/utils/errorUtils";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import { getSignedUser } from "@/api/queries/userQueries";

const ChatContainer: React.FC<GenericWrapper> = ({ children }) => {

    const classes = styles();

    let data = undefined;

    try {
        const user = getSignedUser();
        if (user === undefined) throw nullishValidationdError({ user });
        data = useGetChats();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `could not load chat data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const { data: chats, isLoading, isError } = data;


    if (isLoading) return <FullLoadingOverlay />;
    if (isError || chats === undefined) return <ErrorComponent message='could not fetch chat data!' />;

    return (
        <DefaultContainer className={classes.container}>
            <ChatSidebar chats={chats} className={classes.contacts} />
            {children}
        </DefaultContainer>
    )
}

export default withErrorBoundary(ChatContainer);