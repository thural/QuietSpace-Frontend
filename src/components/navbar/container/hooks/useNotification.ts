import { Chat } from "@/api/schemas/inferred/chat";
import { PageContent } from "@/api/schemas/inferred/common";
import { NotificationPage } from "@/api/schemas/inferred/notification";
import { User } from "@/api/schemas/inferred/user";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";


const useNotification = () => {

    const queryClient = useQueryClient();
    const chats: PageContent<Chat> | undefined = queryClient.getQueryData(["chats"]);
    const user: User | undefined = queryClient.getQueryData(["user"]);
    const notifications: NotificationPage | undefined = queryClient.getQueryData(["notifications"]);

    if (user === undefined) throw nullishValidationdError({ user });

    var hasUnreadChat = useMemo(() => {
        return chats?.some(({ recentMessage }) => {
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