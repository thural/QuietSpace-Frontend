import { getSignedUser } from "@/api/queries/userQueries";
import { Message } from "@/api/schemas/inferred/chat";
import useWasSeen from "@/services/useWasSeen";
import { useChatStore } from "@/services/zustand";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useEffect, useState } from "react";

const useMessage = (message: Message) => {

    const user = getSignedUser();
    if (user === undefined) throw nullishValidationdError({ user });

    const { clientMethods } = useChatStore();
    const { deleteChatMessage, setMessageSeen, isClientConnected } = clientMethods;

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
        deleteChatMessage,
        appliedStyle,
        handleMouseOver,
        handleMouseOut,
        setMessageSeen,
        isClientConnected
    };
};

export default useMessage;