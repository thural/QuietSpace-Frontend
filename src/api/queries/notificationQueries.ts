import { useQueryClient } from "@tanstack/react-query";
import { Notification, NotificationPage } from "../schemas/inferred/notification";
import { ChatEvent } from "../schemas/inferred/chat";
import { Page } from "../schemas/inferred/common";



export const handleReceivedNotifcation = (notification: Notification) => {
    const queryClient = useQueryClient();
    queryClient.setQueryData(['notifications'], (oldData: NotificationPage) => {
        const oldContent = oldData.content;
        const updatedContent = [...oldContent, notification];
        return { ...oldData, content: updatedContent };
    });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
};

export const handleSeenNotification = (eventBody: ChatEvent) => {
    const queryClient = useQueryClient();
    queryClient.setQueryData(['notifications'], (oldData: NotificationPage) => {
        const oldContent = oldData.content;
        const updatedContent = oldContent.map(notification => {
            if (notification.id !== eventBody.recipientId) return notification;
            notification.isSeen = true;
            return notification;
        });
        return { ...oldData, content: updatedContent };
    });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
};

export const getNotificationsCache = (): Page<Notification> | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["notifications"]);
}