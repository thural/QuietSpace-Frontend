import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { MessageResponse } from "@/api/schemas/inferred/chat";
import useWasSeen from "@/services/hook/common/useWasSeen";
import { useChatStore } from "@/services/store/zustand";
import { useEffect, useState } from "react";

const useMessage = (message: MessageResponse) => {

    const user = getSignedUserElseThrow();
    const [wasSeen, wasSeenRef] = useWasSeen();
    const { clientMethods } = useChatStore();
    const { deleteChatMessage, setMessageSeen, isClientConnected } = clientMethods;


    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        setIsHovering(true);
    };
    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const handleSeenMessage = () => {
        if (!isClientConnected) return console.error("stomp client is not connected yet");
        if (message.senderId === user.id) return;
        if (message.isSeen || !wasSeen) return;
        setMessageSeen(message.id);
    };

    const handleDeleteMessage = () => deleteChatMessage(message.id);

    useEffect(handleSeenMessage, [wasSeen, isClientConnected]);


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