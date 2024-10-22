import { NotificationSchema } from "@/api/schemas/notification";
import { GenericWrapper } from "./sharedComponentTypes";
import { ContentResponse } from "@/api/schemas/common";
import { AnyFunction } from "./genericTypes";

export interface NotificationItemProps extends GenericWrapper {
    notification: NotificationSchema
}

export interface NotificationListProps {
    notifications: ContentResponse<NotificationSchema>
}

export interface NotificationCardProps extends GenericWrapper {
    notification: any
    onClick: AnyFunction
    text: string
}