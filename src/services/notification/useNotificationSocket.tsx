import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationStore, useStompStore } from "../store/zustand";
import { User } from "@/api/schemas/inferred/user";
import { ChatEvent } from "@/api/schemas/inferred/chat";
import { Notification, NotificationPage } from "@/api/schemas/inferred/notification";
import { ResId } from "@/api/schemas/native/common";
import { ChatEventSchema } from "@/api/schemas/zod/chatZod";
import { Frame } from "stompjs";


const useNotificationSocket = () => {

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    const { setClientMethods } = useNotificationStore();
    const { clientContext } = useStompStore();
    const { subscribe, sendMessage, isClientConnected } = clientContext;


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


    const onSubscribe = (message: Frame) => {
        const messageBody: ChatEvent | Notification = JSON.parse(message.body);
        if (ChatEventSchema.safeParse(messageBody).success)
            handleSeenNotification(messageBody as ChatEvent);
        else handleReceivedNotifcation(messageBody as Notification);
    }


    const setNotificationSeen = (notificationId: ResId) => {
        sendMessage(`/app/private/notifications/seen/${notificationId}`);
    }


    const clientMethods = { setNotificationSeen, isClientConnected };

    const setup = () => {
        if (!isClientConnected || !user) return;
        subscribe(`/user/${user.id}/private/notifications`, onSubscribe);
        subscribe(`/user/${user.id}/private/notifications/event`, onSubscribe);
        setClientMethods(clientMethods);
    }

    useEffect(setup, [isClientConnected, user])
    return clientMethods;
}

export default useNotificationSocket