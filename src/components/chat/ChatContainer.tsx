import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import DefaultContainer from "@/components/shared/DefaultContainer";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import { useGetChats } from "@/services/data/useChatData";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/chat/chatContainerStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import LoaderStyled from "../shared/LoaderStyled";
import ChatSidebar from "./sidebar/ChatSidebar";

const ChatContainer: React.FC<GenericWrapper> = ({ children }) => {

    const classes = styles();

    let data = undefined;

    try {
        getSignedUserElseThrow();
        data = useGetChats();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `could not load chat data: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />;
    }

    const { data: chats, isLoading, isError } = data;


    if (isLoading) return <LoaderStyled />;
    if (isError || chats === undefined) return <ErrorComponent message='could not fetch chat data!' />;

    return (
        <DefaultContainer className={classes.container}>
            <ChatSidebar chats={chats} className={classes.contacts} />
            {children}
        </DefaultContainer>
    )
}

export default withErrorBoundary(ChatContainer);