import { UserPage } from "@/api/schemas/inferred/user"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { UseQueryResult } from "@tanstack/react-query"

export interface ConnectionsProps extends GenericWrapper {
    userFetch: UseQueryResult<UserPage>
    title: string
}