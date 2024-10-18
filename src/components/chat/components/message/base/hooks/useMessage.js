import useWasSeen from "@hooks/useWasSeen";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useMessage = (message, setMessageSeen, isClientConnected) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const [isHovering, setIsHovering] = useState(false);
    const [wasSeen, ref] = useWasSeen();

    const appliedStyle = message.senderId !== user.id ? {
        marginRight: "auto",
        borderRadius: '1.25rem 1.25rem 1.25rem 0rem',
    } : {
        marginLeft: "auto",
        color: "white",
        borderColor: "blue",
        backgroundColor: "#3c3cff",
        borderRadius: '1rem 1rem 0rem 1rem'
    };

    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const handleSeenMessage = () => {
        if (!isClientConnected || message.senderId === user.id) return;
        if (message.isSeen || !wasSeen) return;
        setMessageSeen(message.id);
    };

    useEffect(handleSeenMessage, [wasSeen, isClientConnected]);

    return {
        user,
        isHovering,
        setIsHovering,
        wasSeen,
        ref,
        appliedStyle,
        handleMouseOver,
        handleMouseOut,
    };
};

export default useMessage;