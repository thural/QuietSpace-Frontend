import chatQueries from "@/api/queries/chatQueries";
import { ChatEvent, Message } from "@/api/schemas/inferred/chat"

const chatHandler = () => {

    const { deleteMessageCache, insertMessageCache, setMessageSeenCache, updateChatCache } = chatQueries();

    const handleChatException = (message: ChatEvent) => {
        console.log("error on receiving message: ", message)
    }

    const handleOnlineUser = (chatEvent: ChatEvent) => {
        // TODO: implement online badge
    }

    const handleChatDelete = (chatEvent: ChatEvent) => {
        // TODO: mutate chat cache
    }

    const handleDeleteMessage = (chatEvent: ChatEvent) => {
        deleteMessageCache(chatEvent);
    }

    const handleSeenMessage = (chatEvent: ChatEvent) => {
        setMessageSeenCache(chatEvent);
    }

    const handleLeftChat = (chatEvent: ChatEvent) => {
        // TODO: mutate chat cache
    }

    const hadnleRecievedMessage = (messageBody: Message) => {
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