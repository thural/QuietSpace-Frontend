import { ChatEvent } from "@/api/schemas/inferred/chat"

export const handleChatException = (message: ChatEvent) => {
    console.log("error on receiving message: ", message)
}

export const handleOnlineUser = (message: ChatEvent) => {
    // TODO: implement online badge
}

export const handleChatDelete = (message: ChatEvent) => {
    // TODO: mutate chat cache
}

export const handleDeleteMessage = (message: ChatEvent) => {
    // TODO: mutate message cache
}

export const handleSeenMessage = (message: ChatEvent) => {
    // TODO: mutate message cache
}

export const handleLeftChat = (message: ChatEvent) => {
    // TODO: mutate mutate chat cache
}