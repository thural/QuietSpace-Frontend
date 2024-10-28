import ChatContainer from "@components/chat/container/ChatContainer";
import { Outlet } from "react-router-dom";

const ChatPage = () => {
    return <ChatContainer>
        <Outlet />
    </ChatContainer>
}

export default ChatPage