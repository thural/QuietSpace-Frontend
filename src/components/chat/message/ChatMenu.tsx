import { ProcedureFn } from "@/types/genericTypes";
import Clickable from "@shared/Clickable";
import Conditional from "@shared/Conditional";
import ListMenu from "@shared/ListMenu";
import { PiDotsThreeVertical } from "react-icons/pi";

interface ChatMenuProps {
    isMutable: boolean
    handleDeleteChat: ProcedureFn
}

const ChatMenu: React.FC<ChatMenuProps> = ({ isMutable, handleDeleteChat }) => {

    const handleChatMute = () => {
        // TODO: handle chat mute
    }

    const handleChatRemove = () => {
        handleDeleteChat();
        // TODO: handle chat remove
    }

    const handleChatBlock = () => {
        // TODO: handle chat block
    }

    const handleChatReport = () => {
        // TODO: handle chat report
    }

    return (
        <ListMenu menuIcon={<PiDotsThreeVertical />} >
            <Conditional isEnabled={isMutable}>
                <Clickable handleClick={handleChatMute} alt="mute chat" text="mute" />
                <Clickable handleClick={handleChatRemove} alt="remove chat" text="remove" />
                <Clickable handleClick={handleChatBlock} alt="block chat" text="block" />
                <Clickable handleClick={handleChatReport} alt="report chat" text="report" />
            </Conditional>
        </ListMenu>
    )
}

export default ChatMenu