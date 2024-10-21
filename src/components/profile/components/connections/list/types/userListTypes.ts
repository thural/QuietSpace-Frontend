import { PagedUserResponse, UserListResponse } from "@/api/schemas/user"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { UseQueryResult } from "@tanstack/react-query"
import { MouseEventHandler } from "react"

export interface UserListProps extends GenericWrapper {
    userFetch: UseQueryResult<PagedUserResponse>
    handleItemClick: MouseEventHandler<HTMLInputElement>
    queryResult: UserListResponse
}