import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useStompClient } from "./useStompClient";


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

    const onSubscribe = (message) => {
        const notification = JSON.parse(message.body);
        handleReceivedNotifcation(notification);
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
    }


    useEffect(setup, [isClientConnected, user]);




    return {};
}

export default useNotificationSocket