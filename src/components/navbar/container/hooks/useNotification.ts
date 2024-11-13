import chatQueries from "@/api/queries/chatQueries";
import notificationQueries from "@/api/queries/notificationQueries";
import { getSignedUser } from "@/api/queries/userQueries";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useMemo } from "react";


const useNotification = () => {
    const { getChatsCache } = chatQueries();
    const chats = getChatsCache();
    const user = getSignedUser();
    const { getNotificationsCache } = notificationQueries();
    const notifications = getNotificationsCache();

    if (user === undefined) throw nullishValidationdError({ user });

    var hasUnreadChat = useMemo(() => {
        if (!chats) return false;
        return chats.some(({ recentMessage }) => {
            !recentMessage?.isSeen && recentMessage?.senderId !== user.id
        });
    }, [chats]);

    var hasPendingNotification = useMemo(() => {
        if (notifications === undefined) return false;
        return notifications.content.some(({ isSeen }) => !isSeen);
    }, [notifications]);

    return { hasPendingNotification, hasUnreadChat }
}

export default useNotification