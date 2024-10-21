import { ContentResponse, PagedResponse } from "./common"

export interface UserSchema {
    id: string | number
    role: string
    username: string
    email: string
    isPrivateAccount: boolean
    createDate: Date
    updateDate: Date
}

export type UserListResponse = ContentResponse<UserSchema>

export type PagedUserResponse = PagedResponse<UserSchema>