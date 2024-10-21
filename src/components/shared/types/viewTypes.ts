export interface ViewState {
    overlay: boolean
    createPost: boolean
    editPost: boolean
    followings: boolean
    followers: boolean
}

export interface ChatState {
    activeChatId: null | string,
    messageInput: Record<string, string>
}