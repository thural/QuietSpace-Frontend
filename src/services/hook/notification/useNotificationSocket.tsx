import notificationQueries from "@/api/queries/notificationQueries";
import useUserQueries from "@/api/queries/userQueries";
import { NotificationResponse, NotificationEvent } from "@/api/schemas/inferred/notification";
import { ResId } from "@/api/schemas/native/common";
import { NotificationEventSchema } from "@/api/schemas/zod/notificationZod";
import { useNotificationStore, useStompStore } from "@/services/store/zustand";
import { useEffect } from "react";
import { Frame } from "stompjs";


const useNotificationSocket = () => {

    const { getSignedUser } = useUserQueries();
    const user = getSignedUser();
    const { setClientMethods } = useNotificationStore();
    const { handleReceivedNotifcation, handleSeenNotification } = notificationQueries();
    const { clientContext } = useStompStore();
    const { subscribe, sendMessage, isClientConnected } = clientContext;


    const onSubscribe = (message: Frame) => {
        const messageBody: NotificationResponse | NotificationEvent = JSON.parse(message.body);
        if (NotificationEventSchema.safeParse(messageBody).success)
            handleSeenNotification(messageBody as NotificationEvent);
        else handleReceivedNotifcation(messageBody as NotificationResponse);
    }

    const setNotificationSeen = (notificationId: ResId) => {
        if (sendMessage) sendMessage(`/app/private/notifications/seen/${notificationId}`);
    }

    const clientMethods = { setNotificationSeen, isClientConnected };

    const setup = () => {
        if (!isClientConnected || !user || !subscribe) return;
        subscribe(`/user/${user.id}/private/notifications`, onSubscribe);
        subscribe(`/user/${user.id}/private/notifications/event`, onSubscribe);
        setClientMethods(clientMethods);
    }

    useEffect(setup, [isClientConnected, user]);
    return clientMethods;
}

export default useNotificationSocket