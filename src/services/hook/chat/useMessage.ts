import useUserQueries from "@/api/queries/userQueries";
import { MessageResponse } from "@/api/schemas/inferred/chat";
import useWasSeen from "@/services/hook/common/useWasSeen";
import { useChatStore } from "@/services/store/zustand";
import { useCallback, useEffect } from "react";
import useHoverState from "../shared/useHoverState";


export const useMessage = (message: MessageResponse) => {
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    const [wasSeen, wasSeenRef] = useWasSeen();
    const { clientMethods } = useChatStore();
    const { deleteChatMessage, setMessageSeen, isClientConnected } = clientMethods;


    const {
        isHovering,
        handleMouseOver,
        handleMouseOut
    } = useHoverState();

    const handleSeenMessage = useCallback(() => {

        if (!isClientConnected) {
            console.error("stomp client is not connected yet");
            return;
        }

        if (
            message.senderId === user.id ||
            message.isSeen ||
            !wasSeen
        ) return;

        setMessageSeen(message.id);
    }, [
        isClientConnected,
        message.senderId,
        message.id,
        message.isSeen,
        user.id,
        wasSeen,
        setMessageSeen
    ]);


    const handleDeleteMessage = useCallback(() => {
        deleteChatMessage(message.id);
    }, [deleteChatMessage, message.id]);


    useEffect(() => {
        handleSeenMessage();
    }, [wasSeen, isClientConnected, handleSeenMessage]);

    return {
        user,
        isHovering,
        wasSeenRef,
        handleMouseOver,
        handleMouseOut,
        handleDeleteMessage,
    };
};

export default useMessage;