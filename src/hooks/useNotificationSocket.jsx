import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useStompClient } from "./useStompClient";
import { ChatEventType } from "../utils/enumClasses";


const useNotificationSocket = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);



    const handleReceivedNotifcation = (notification) => {
        queryClient.setQueryData(['notifications'], (oldData) => {
            const oldContent = oldData.content;
            const updatedContent = [...oldContent, notification];
            return { content: updatedContent, ...oldData };
        });
    }

    const handleSeenNotification = (event) => {
        queryClient.setQueryData(['notifications'], (oldData) => {
            const oldContent = oldData.content;
            const updatedContent = oldContent.map(n => {
                if (n.id !== event.notificationId) return n;
                n.isSeen = true; return n;
            });
            return { content: updatedContent, ...oldData };
        });
    }

    const onSubscribe = (message) => {
        const messageBody = JSON.parse(message.body);
        if (messageBody.type === ChatEventType.SEEN_NOTIFICATION.name) {
            handleSeenNotification(messageBody);
        } else handleReceivedNotifcation(messageBody);
    }

    const setNotificationSeen = (notificationId) => {
        sendMessage(`/private/notifications/seen/${notificationId}`)
    }


    const {
        disconnect,
        subscribe,
        sendMessage,
        setAutoReconnect,
        isClientConnected,
        isConnecting,
        isDisconnected,
        isError,
        error
    } = useStompClient({ onSubscribe });

    const setup = () => {
        if (!isClientConnected || !user) return;
        subscribe(`/user/${user.id}/private/notifications`);
        subscribe(`/user/${user.id}/private/notifications/event`);
    }


    useEffect(setup, [isClientConnected, user]);




    return { setNotificationSeen, isClientConnected };
}

export default useNotificationSocket