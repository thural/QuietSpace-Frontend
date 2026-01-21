import { NotificationResponse } from "@/features/notification/data/models/notification";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

export interface NotificationItemProps extends GenericWrapper {
    notification: NotificationResponse
}

export interface NotificationCardProps extends GenericWrapper {
    notification: NotificationResponse
    onClick: ConsumerFn
    text: string
}