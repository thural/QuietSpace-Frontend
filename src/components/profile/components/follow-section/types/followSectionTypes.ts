import { ProcedureFn } from "@/types/genericTypes"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { ResId } from "@/api/schemas/native/common"

export interface FollowSectionProps extends GenericWrapper {
    userId: ResId
    toggleFollowings: ProcedureFn
    toggleFollowers: ProcedureFn
}