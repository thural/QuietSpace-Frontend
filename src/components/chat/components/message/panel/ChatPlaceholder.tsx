import { PiChatsCircle } from "react-icons/pi"
import Placeholder from "../placeholder/ChatPlaceHolder"

const ChatPlaceholder = ({ message = "start a chat" }) => {
    return <Placeholder Icon={PiChatsCircle} message={message} type="h3" />
}

export default ChatPlaceholder