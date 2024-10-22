import { PagedResponse } from "./common"

export enum NotificationType {
    FOLLOW_REQUEST,
    POST_REACTION,
    MENTION,
    COMMENT,
    COMMENT_REACTION,
    COMMENT_REPLY,
    REPOST
}

export interface NotificationSchema {
    id: string | number
    actorId: string | number
    contentId: string | number
    isSeen: boolean
    type: string
    updateDate: Date
}

export type PagedNotificationResponse = PagedResponse<NotificationSchema>