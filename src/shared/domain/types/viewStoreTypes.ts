export interface ViewState {
    overlay: boolean
    createPost: boolean
    editPost: boolean
    followings: boolean
    followers: boolean
}

export interface ViewStoreProps {
    data: ViewState;
    setViewData: (state: ViewState, viewData: Partial<ViewState>) => void;
}

export interface ChatState {
    activeChatId: null | string,
    messageInput: Record<string, string>
}