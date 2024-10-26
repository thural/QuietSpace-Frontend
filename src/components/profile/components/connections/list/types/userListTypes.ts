import { UserPage, UserList } from "@/api/schemas/inferred/user"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { UseQueryResult } from "@tanstack/react-query"
import { MouseEventHandler } from "react"

export interface UserListProps extends GenericWrapper {
    userFetch: UseQueryResult<UserPage>
    handleItemClick: MouseEventHandler<HTMLInputElement>
    queryResult: UserList
}