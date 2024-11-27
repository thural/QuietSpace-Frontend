import { NotificationResponse } from "@/api/schemas/inferred/notification";
import { ConsumerFn } from "./genericTypes";
import { GenericWrapper } from "./sharedComponentTypes";

export interface NotificationItemProps extends GenericWrapper {
    notification: NotificationResponse
}

export interface NotificationCardProps extends GenericWrapper {
    notification: NotificationResponse
    onClick: ConsumerFn
    text: string
}