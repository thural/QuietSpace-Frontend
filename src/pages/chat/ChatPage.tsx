import ChatContainer from "@/features/chat/presentation/ChatContainer";
import { Outlet } from "react-router-dom";

const ChatPage = () => {
    return <ChatContainer>
        <Outlet />
    </ChatContainer>
}

export default ChatPage