import DefaultContainer from "@/components/shared/DefaultContainer";
import Typography from "@/components/shared/Typography";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import ChatSidebar from "../components/sidebar/panel/ChatSidebar"
import styles from "./styles/chatContainerStyles";
import { useGetChatsByUserId } from "@/services/data/useChatData";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/api/schemas/inferred/user";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useParams } from "react-router-dom";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";

const ChatContainer: React.FC<GenericWrapper> = ({ children }) => {

    const classes = styles();

    const { chatId } = useParams();
    console.log("chatId on ChatContianer: ", chatId);

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);

    if (user === undefined) throw nullishValidationdError({ user });

    const { isLoading, isError } = useGetChatsByUserId(user.id);


    if (isLoading) return <FullLoadingOverlay />;
    if (isError) return <Typography type="h1">{'(!) could not fetch chat data!'}</Typography>;


    return (
        <DefaultContainer className={classes.container}>
            <ChatSidebar className={classes.contacts} />
            {children}
        </DefaultContainer>
    )
}

export default ChatContainer