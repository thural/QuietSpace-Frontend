import { NotificationResponse } from "@/api/schemas/notification";
import { GenericWrapper } from "./sharedComponentTypes";
import { ContentResponse } from "@/api/schemas/common";
import { AnyFunction } from "./genericTypes";

export interface NotificationItemProps extends GenericWrapper {
    notification: NotificationResponse
}

export interface NotificationListProps {
    notifications: ContentResponse<NotificationResponse>
}

export interface NotificationCardProps extends GenericWrapper {
    notification: any
    onClick: AnyFunction
    text: string
}