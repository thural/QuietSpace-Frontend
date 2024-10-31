import { useEffect } from "react";
import { useNotificationStore, useStompStore } from "../store/zustand";
import { ChatEvent } from "@/api/schemas/inferred/chat";
import { Notification } from "@/api/schemas/inferred/notification";
import { ResId } from "@/api/schemas/native/common";
import { ChatEventSchema } from "@/api/schemas/zod/chatZod";
import { Frame } from "stompjs";
import { handleReceivedNotifcation, handleSeenNotification } from "@/api/queries/notificationQueries";
import { getSignedUser } from "@/api/queries/userQueries";


const useNotificationSocket = () => {

    const user = getSignedUser();
    const { setClientMethods } = useNotificationStore();
    const { clientContext } = useStompStore();
    const { subscribe, sendMessage, isClientConnected } = clientContext;


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

    useEffect(setup, [isClientConnected, user]);
    return clientMethods;
}

export default useNotificationSocket