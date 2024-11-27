import chatQueries from "@/api/queries/chatQueries";
import { ChatEvent, MessageResponse } from "@/api/schemas/inferred/chat"

const chatHandler = () => {

    const { deleteMessageCache, insertMessageCache, setMessageSeenCache, updateChatCache } = chatQueries();

    const handleChatException = (event: ChatEvent) => {
        console.log("error on receiving message: ", event)
    }

    const handleOnlineUser = (event: ChatEvent) => {
        // TODO: implement online badge
    }

    const handleChatDelete = (event: ChatEvent) => {
        // TODO: mutate chat cache
    }

    const handleDeleteMessage = (event: ChatEvent) => {
        deleteMessageCache(event);
    }

    const handleSeenMessage = (event: ChatEvent) => {
        setMessageSeenCache(event);
    }

    const handleLeftChat = (event: ChatEvent) => {
        // TODO: mutate chat cache
    }

    const hadnleRecievedMessage = (messageBody: MessageResponse) => {
        insertMessageCache(messageBody);
        updateChatCache(messageBody);
    }

    return {
        handleChatException,
        handleOnlineUser,
        handleChatDelete,
        handleDeleteMessage,
        handleSeenMessage,
        handleLeftChat,
        hadnleRecievedMessage
    }
}

export default chatHandler