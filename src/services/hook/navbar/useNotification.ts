import chatQueries from "@/api/queries/chatQueries";
import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { NotificationResponse } from "@/api/schemas/inferred/notification";
import { useGetNotifications } from "@/services/data/useNotificationData";
import { useMemo } from "react";


const useNotification = () => {

    const { getChatsCache } = chatQueries();
    const chats = getChatsCache();
    const user = getSignedUserElseThrow();
    const { data, isLoading } = useGetNotifications();

    const flatPages = () => !!data ? data.pages.flatMap((page) => page.content) : [];
    const content: Array<NotificationResponse> = useMemo(flatPages, [isLoading]);

    const hasUnreadChat = useMemo(() => {
        if (!chats) return false;
        return chats.some(({ recentMessage }) => {
            !recentMessage?.isSeen && recentMessage?.senderId !== user.id
        });
    }, [chats]);

    const hasPendingNotification = useMemo(() => {
        if (content === undefined) return false;
        return content.some(({ isSeen }) => !isSeen);
    }, [isLoading]);

    return { hasPendingNotification, hasUnreadChat, isLoading }
}

export default useNotification