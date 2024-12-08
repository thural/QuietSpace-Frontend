import { genNotificationText, pickNotificationFilter } from '@/utils/notificationUtils';
import { NotificationResponse } from "@/api/schemas/inferred/notification";
import { NotificationType } from "@/api/schemas/native/notification";

describe('notificationUtils', () => {
    describe('genNotificationText', () => {
        it('should return correct notification text for POST_REACTION', () => {
            expect(genNotificationText(NotificationType.POST_REACTION)).toBe("reacted to your post");
        });

        it('should return correct notification text for COMMENT', () => {
            expect(genNotificationText(NotificationType.COMMENT)).toBe("commented your post");
        });

        it('should return correct notification text for REPOST', () => {
            expect(genNotificationText(NotificationType.REPOST)).toBe("reposted your post");
        });

        it('should return correct notification text for COMMENT_REPLY', () => {
            expect(genNotificationText(NotificationType.COMMENT_REPLY)).toBe("replied your comment");
        });

        it('should return correct notification text for COMMENT_REACTION', () => {
            expect(genNotificationText(NotificationType.COMMENT_REACTION)).toBe("reacted your comment");
        });

        it('should return correct notification text for MENTION', () => {
            expect(genNotificationText(NotificationType.MENTION)).toBe("mentioned you");
        });

        it('should return "invalid notification type" for an unknown type', () => {
            expect(genNotificationText("UNKNOWN_TYPE")).toBe("invalid notification type");
        });
    });

    describe('pickNotificationFilter', () => {
        const notifications: NotificationResponse[] = [
            { type: NotificationType.FOLLOW_REQUEST, id: 1, actorId: 2, contentId: 3, isSeen: false },
            { type: NotificationType.REPOST, id: 2, actorId: 3, contentId: 4, isSeen: true },
            { type: NotificationType.MENTION, id: 3, actorId: 4, contentId: 5, isSeen: false },
            { type: NotificationType.COMMENT, id: 4, actorId: 5, contentId: 6, isSeen: true },
        ];

        it('should return all notifications for "all" category', () => {
            const filter = pickNotificationFilter("all");
            expect(notifications.filter(filter)).toEqual(notifications);
        });

        it('should return only repost notifications for "reposts" category', () => {
            const filter = pickNotificationFilter("reposts");
            expect(notifications.filter(filter)).toEqual([notifications[1]]);
        });

        it('should return only mention notifications for "mentions" category', () => {
            const filter = pickNotificationFilter("mentions");
            expect(notifications.filter(filter)).toEqual([notifications[2]]);
        });

        it('should return only follow request notifications for "requests" category', () => {
            const filter = pickNotificationFilter("requests");
            expect(notifications.filter(filter)).toEqual([notifications[0]]);
        });

        it('should return only reply notifications for "replies" category', () => {
            const replyNotification: NotificationResponse = { type: NotificationType.COMMENT_REPLY, id: 5, actorId: 6, contentId: 7, isSeen: true };
            notifications.push(replyNotification);
            const filter = pickNotificationFilter("replies");
            expect(notifications.filter(filter)).toEqual([notifications[3], replyNotification]);
        });
    });
});