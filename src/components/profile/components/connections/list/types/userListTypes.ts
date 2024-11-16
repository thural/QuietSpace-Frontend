import { UserList, UserPage } from "@/api/schemas/inferred/user"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { UseQueryResult } from "@tanstack/react-query"
import { JSXElementConstructor } from "react"

export interface UserListProps extends GenericWrapper {
    userFetch: UseQueryResult<UserPage>
    queryResult: UserList
    itemProps?: Object
    Item: JSXElementConstructor<any>
}