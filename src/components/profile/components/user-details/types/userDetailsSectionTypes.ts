import { User } from "@/api/schemas/inferred/user";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";

export interface UserDetailsSectionProps extends GenericWrapper {
    user: User
}