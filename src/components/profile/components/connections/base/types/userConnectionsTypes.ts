import { PagedUserResponse } from "@/api/schemas/user"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { UseQueryResult } from "@tanstack/react-query"

export interface ConnectionsProps extends GenericWrapper {
    userFetch: UseQueryResult<PagedUserResponse>
    title: string
}