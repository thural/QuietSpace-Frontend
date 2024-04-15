import { Avatar, Text } from "@mantine/core";
import styles from "./styles/contactStyles";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../../hooks/zustand";
import { generatePfp } from "../../utils/randomPfp";
import { useMemo } from "react";

const Contact = ({ contact }) => {

    const { setActiveChatId } = useChatStore();
    const queryClient = useQueryClient();
    const chats = queryClient.getQueryData(["chats"]);

    const chatOfThisContact = useMemo(() => {
        console.log("chat of this contact was computed");
        return chats?.find(chat => chat.users.some(user => user.id === contact.id))
    }, [chats]);

    const recentText = useMemo(() => {
        console.log("chat of this text was computed");
        return Array.from(chatOfThisContact.messages).pop()?.text;
    }, [chats]);

    const genratedPfpLink = useMemo(() => generatePfp("beam"), [chats]);

    const handleClick = () => {
        setActiveChatId(chatOfThisContact.id);
    }

    const classes = styles();

    return (
        <div id={contact.id} className={classes.contact} onClick={handleClick} >
            <Avatar
                color="black"
                size="2.5rem"
                radius="10rem"
                src={genratedPfpLink}>
                {contact.username[0].toUpperCase()}
            </Avatar>
            <div className={classes.text}>
                <Text size="sm" lineClamp={1}>{recentText ? recentText : "chat is empty"}</Text>
                <Text size="xs" lineClamp={1}>seen 1 day ago</Text>
            </div>
        </div>
    )
}

export default Contact