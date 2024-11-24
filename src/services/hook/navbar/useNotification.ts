import chatQueries from "@/api/queries/chatQueries";
import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { useGetNotifications } from "@/services/data/useNotificationData";
import { useMemo } from "react";


const useNotification = () => {

    return { hasPendingNotification: false, hasUnreadChat: false }

    // const { getChatsCache } = chatQueries();
    // const chats = getChatsCache();
    // const user = getSignedUserElseThrow();


    // const { data, isLoading } = useGetNotifications();

    // if (isLoading) return { hasPendingNotification: false, hasUnreadChat: false }

    // const hasUnreadChat = useMemo(() => {
    //     if (!chats) return false;
    //     return chats.some(({ recentMessage }) => {
    //         !recentMessage?.isSeen && recentMessage?.senderId !== user.id
    //     });
    // }, [chats]);

    // const content = data.pages.flatMap((page) => page.content);

    // const hasPendingNotification = useMemo(() => {
    //     if (content === undefined) return false;
    //     return content.some(({ isSeen }) => !isSeen);
    // }, [data]);

    // return { hasPendingNotification, hasUnreadChat }
}

export default useNotification