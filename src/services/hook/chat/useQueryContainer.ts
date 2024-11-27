import chatQueries from "@/api/queries/chatQueries";
import { getSignedUserElseThrow } from "@/api/queries/userQueries";
import { ChatResponse, MessageResponse } from "@/api/schemas/inferred/chat";
import { UserResponse } from "@/api/schemas/inferred/user";
import { useGetChats } from "@/services/data/useChatData";
import { useQueryUsers } from "@/services/data/useUserData";
import { nullishValidationdError } from "@/utils/errorUtils";
import React, { useRef, useState } from "react";
import useNavigation from "../shared/useNavigation";


const useQueryContainer = () => {

    const user = getSignedUserElseThrow();
    const { navigatePath } = useNavigation();
    const { insertMessageCache, insertInitChatCache } = chatQueries();
    const { data: chats, isLoading, isError } = useGetChats();


    const [focused, setFocused] = useState(false);
    const [queryResult, setQueryResult] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleChatCreation = async (event: React.MouseEvent, clickedUser: UserResponse) => {
        event.preventDefault();

        if (isLoading || isError) throw nullishValidationdError({ chats });

        const isExistingChat = chats?.some(chat => chat.members
            .some(user => user.id === clickedUser.id));

        if (isExistingChat) return;

        const newMessage: MessageResponse = {
            id: crypto.randomUUID(),
            createDate: String(new Date),
            updateDate: String(new Date),
            chatId: "-1",
            senderId: user.id,
            version: 1,
            recipientId: clickedUser.id,
            text: "opened new chat",
            isSeen: true,
            senderName: user.username
        }
        const newChat: ChatResponse = {
            id: "-1",
            createDate: String(new Date),
            userIds: [user.id, clickedUser.id],
            recentMessage: newMessage,
            members: [user, clickedUser],
            updateDate: String(new Date),
            version: 1
        }

        insertMessageCache(newMessage);
        insertInitChatCache(newChat);
        navigatePath("-1");
    };

    const makeQueryMutation = useQueryUsers(setQueryResult);
    const handleQuerySubmit = async (value: string) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        makeQueryMutation.mutate(value);
        setTimeout(() => { setIsSubmitting(false); }, 1000);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFocused(true);
        if (value.length) handleQuerySubmit(value);
        else setQueryResult([]);
    };


    const handleKeyDown = (event: React.KeyboardEvent) => { if (event.key === 'Escape') setFocused(false) };
    const handleInputFocus = () => setFocused(true);

    const resultListRef = useRef<HTMLDivElement>(null);
    const handleInputBlur = (event: React.FocusEvent) => {
        if (resultListRef.current && resultListRef.current.contains(event.relatedTarget as Node)) return;
        // setFocused(false);
    };

    const searchInputRef = useRef(null);
    const appliedStyle = (!focused) ? { display: 'none' } : { display: 'flex' };
    const inputProps = { handleInputFocus, handleInputBlur, handleKeyDown, handleInputChange, searchInputRef, resultListRef };



    return {
        focused,
        queryResult,
        isSubmitting,
        handleChatCreation,
        handleQuerySubmit,
        appliedStyle,
        inputProps,
        makeQueryMutation,
    };
};

export default useQueryContainer