import { Notification } from "@/api/schemas/inferred/notification";
import { ConsumerFn } from "./genericTypes";
import { GenericWrapper } from "./sharedComponentTypes";

export interface NotificationItemProps extends GenericWrapper {
    notification: Notification
}

export interface NotificationCardProps extends GenericWrapper {
    notification: Notification
    onClick: ConsumerFn
    text: string
}