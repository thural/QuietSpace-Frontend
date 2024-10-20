export interface UserSchema {
    id: string | number
    role: string
    username: string
    email: string
    isPrivateAccount: boolean
    createDate: Date
    updateDate: Date
}