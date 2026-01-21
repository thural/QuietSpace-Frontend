import { PagedResponse } from "./common"

export enum NotificationType {
    FOLLOW_REQUEST = "FOLLOW_REQUEST",
    POST_REACTION = "POST_REACTION",
    MENTION = "MENTION",
    COMMENT = "COMMENT",
    COMMENT_REACTION = "COMMENT_REACTION",
    COMMENT_REPLY = "COMMENT_REPLY",
    REPOST = "REPOST"
}

export interface NotificationSchema {
    id: string | number
    actorId: string | number
    contentId: string | number
    isSeen: boolean
    type: string
    updateDate: string
}

export type PagedNotificationResponse = PagedResponse<NotificationSchema>