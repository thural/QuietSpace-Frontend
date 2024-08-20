import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChatEventType } from "../utils/enumClasses";
import { useNotificationStore, useStompStore } from "./zustand";


const useNotificationSocket = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { setClientMethods } = useNotificationStore();
    const { clientContext } = useStompStore();
    const { subscribe, sendMessage, isClientConnected } = clientContext;



    const handleReceivedNotifcation = (notification) => {
        queryClient.setQueryData(['notifications'], (oldData) => {
            const oldContent = oldData.content;
            const updatedContent = [...oldContent, notification];
            return { content: updatedContent, ...oldData };
        });

        queryClient.invalidateQueries(["notifications"]);
    }

    const handleSeenNotification = (event) => {
        queryClient.setQueryData(['notifications'], (oldData) => {
            const oldContent = oldData.content;
            const updatedContent = oldContent.map(n => {
                if (n.id !== event.notificationId) return n;
                n.isSeen = true; return n;
            });
            return { content: updatedContent, ...oldData }
        });

        queryClient.invalidateQueries(["notifications"]);
    }

    const onSubscribe = (message) => {
        const messageBody = JSON.parse(message.body);
        if (messageBody.type === ChatEventType.SEEN_NOTIFICATION.name) {
            handleSeenNotification(messageBody);
        } else handleReceivedNotifcation(messageBody);
    }

    const setNotificationSeen = (notificationId) => {
        sendMessage(`/app/private/notifications/seen/${notificationId}`)
    }

    const clientMethods = { setNotificationSeen, isClientConnected };

    const setup = () => {
        if (!isClientConnected || !user) return;
        subscribe(`/user/${user.id}/private/notifications`, onSubscribe);
        subscribe(`/user/${user.id}/private/notifications/event`, onSubscribe);
        setClientMethods(clientMethods);
    }

    useEffect(setup, [isClientConnected, user]);


    return clientMethods;
}

export default useNotificationSocket