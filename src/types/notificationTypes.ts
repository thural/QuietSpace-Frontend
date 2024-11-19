import { Notification } from "@/api/schemas/inferred/notification";
import { GenericWrapper } from "./sharedComponentTypes";
import { PageContent } from "@/api/schemas/inferred/common";
import { AnyFunction } from "./genericTypes";

export interface NotificationItemProps extends GenericWrapper {
    notification: Notification
}

export interface NotificationListProps {
    notifications: PageContent<Notification>
}

export interface NotificationCardProps extends GenericWrapper {
    notification: any
    onClick: AnyFunction
    text: string
}