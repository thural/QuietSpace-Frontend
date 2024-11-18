import { ContentResponse, PagedResponse, ResId } from "./common"

export interface UserSchema {
    id: string | number
    role: string
    username: string
    settings: ProfileSettingsResponse
    email: string
    isPrivateAccount: boolean
    createDate: Date
    updateDate: Date
}

export interface ProfileSettingsRequest {

    bio?: string
    isPrivateAccount?: boolean
    isNotificationsMuted?: boolean
    isAllowPublicGroupChatInvite?: boolean
    isAllowPublicMessageRequests?: boolean
    isAllowPublicComments?: boolean
    isHideLikeCounts?: boolean

}

export interface ProfileSettingsResponse {

    bio?: string
    blockedUserIds: Array<ResId>
    isPrivateAccount?: boolean
    isNotificationsMuted?: boolean
    isAllowPublicGroupChatInvite?: boolean
    isAllowPublicMessageRequests?: boolean
    isAllowPublicComments?: boolean
    isHideLikeCounts?: boolean

}



export type UserListResponse = ContentResponse<UserSchema>
export type PagedUserResponse = PagedResponse<UserSchema>