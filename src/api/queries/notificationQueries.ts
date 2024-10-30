import { useQueryClient } from "@tanstack/react-query";
import { Notification, NotificationPage } from "../schemas/inferred/notification";
import { ChatEvent } from "../schemas/inferred/chat";

const notificationQueries = () => {

    const queryClient = useQueryClient();

    const handleReceivedNotifcation = (notification: Notification) => {
        queryClient.setQueryData(['notifications'], (oldData: NotificationPage) => {
            const oldContent = oldData.content;
            const updatedContent = [...oldContent, notification];
            return { ...oldData, content: updatedContent };
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };


    const handleSeenNotification = (eventBody: ChatEvent) => {
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

    return { handleReceivedNotifcation, handleSeenNotification }
}

export default notificationQueries