import chatQueries from "@/api/queries/chatQueries";
import { Chat, Message } from "@/api/schemas/inferred/chat";
import { User } from "@/api/schemas/inferred/user";
import { useQueryUsers } from "@/services/data/useUserData";
import { nullishValidationdError } from "@/utils/errorUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const useQueryContainer = () => {

    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    if (user === undefined) throw nullishValidationdError({ user });

    const [focused, setFocused] = useState(false);
    const [queryResult, setQueryResult] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const makeQueryMutation = useQueryUsers(setQueryResult);

    const { insertInitChatCache, insertMessageCache } = chatQueries();

    const handleChatCreation = async (event: React.MouseEvent, clickedUser: User) => {
        event.preventDefault();
        // TODO: handle new chat by pushing to local cache

        const newMessage: Message = {
            id: crypto.randomUUID(),
            createDate: new Date,
            updateDate: new Date,
            chatId: -1,
            senderId: user.id,
            version: 1,
            recipientId: clickedUser.id,
            text: "you opened a chat",
            isSeen: true,
            senderName: user.username
        }

        const newChat: Chat = {
            id: -1,
            createDate: new Date,
            userIds: [user.id, clickedUser.id],
            recentMessage: newMessage,
            members: [user, clickedUser],
            updateDate: new Date,
            version: 1
        }

        insertMessageCache(newMessage);
        insertInitChatCache(newChat);
        navigate("-1");
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFocused(true);
        if (value.length) handleQuerySubmit(value);
        else setQueryResult([]);
    };

    const handleQuerySubmit = async (value: string) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        makeQueryMutation.mutate(value);
        setTimeout(() => { setIsSubmitting(false); }, 1000);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => { if (event.key === 'Escape') setFocused(false) };
    const handleInputFocus = () => setFocused(true);
    const handleInputBlur = () => console.log("blur event triggered") // setFocused(false);

    const appliedStyle = (!focused) ? { display: 'none' } : { display: 'block' };
    const inputProps = { handleInputFocus, handleInputBlur, handleKeyDown, handleInputChange };

    return {
        focused,
        queryResult,
        isSubmitting,
        handleChatCreation,
        handleInputChange,
        handleQuerySubmit,
        handleKeyDown,
        handleInputFocus,
        handleInputBlur,
        appliedStyle,
        inputProps,
        makeQueryMutation,
    };
};

export default useQueryContainer;