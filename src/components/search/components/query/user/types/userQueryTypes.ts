import { UserList, UserPage } from "@/api/schemas/inferred/user"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { UseMutationResult } from "@tanstack/react-query"
import { CSSProperties } from "react"

export interface UserQueryProps extends GenericWrapper {
    fetchUserQuery: UseMutationResult<UserPage, Error, string>
    userQueryList: UserList
    style?: CSSProperties
}