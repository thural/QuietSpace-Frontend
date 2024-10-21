import { UserSchema } from "@/api/schemas/user";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";

export interface UserDetailsSectionProps extends GenericWrapper {
    user: UserSchema
}