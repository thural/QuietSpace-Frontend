import { Avatar, Text } from "@mantine/core";
import styles from "./styles/contactStyles";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../../hooks/zustand";

const Contact = ({ contact }) => {

    const { data: storeChatData } = useChatStore();
    const { setActiveChatId } = useChatStore();
    const activeChatId = storeChatData.activeChatId;

    const queryClient = useQueryClient();
    const chats = queryClient.getQueryData(["chats"]);

    const chatOfThisContact = chats?.find(chat => chat.users.some(user => user.id === contact.id));
    const recentText = Array.from(chatOfThisContact.messages).pop()?.text;

    // const userIdOfActiveChat = chats.find(chat => chat.id === activeChatId).users[1].id;
    // const backgroundColor = userIdOfActiveChat === contact.id ? '#e3e3e3' : 'white';

    const handleClick = () => {
        setActiveChatId(chatOfThisContact.id);
    }

    const classes = styles();

    return (
        <div id={contact.id} className={classes.contact} onClick={handleClick} >
            <Avatar color="black" size="2.5rem" radius="10rem">{contact.username[0].toUpperCase()}</Avatar>
            <div className={classes.text}>
                <Text size="sm" lineClamp={1}>{recentText ? recentText : "chat is empty"}</Text>
                <Text size="xs" lineClamp={1}>seen 1 day ago</Text>
            </div>
        </div>
    )
}

export default Contact