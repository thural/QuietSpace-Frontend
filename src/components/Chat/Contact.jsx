import { Avatar, Text } from "@mantine/core";
import styles from "./styles/contactStyles";
import { useQueryClient } from "@tanstack/react-query";

const Contact = ({ contact, currentChatId, setCurrentChatId }) => {

    const queryClient = useQueryClient();
    const chats = queryClient.getQueryData("chats");

    const chatOfThisContact = chats?.find(chat => chat.users.some(user => user.id === contact.id));
    const isCurrentChatEmpty = chatOfThisContact?.messages.length === 0;

    const recentText = isCurrentChatEmpty ? "" : Array.from(chatOfThisContact.messages).pop().text;
    const backgroundColor = currentChatId === contact.id ? '#e3e3e3' : 'white';

    const handleClick = () => {
        setCurrentChatId(chatOfThisContact["id"]);
    }

    const classes = styles();

    return (
        <div id={contact.id} className={classes.contact} onClick={handleClick} style={{ backgroundColor: '#e3e3e3' }}>
            {/* <div className={classes.author}>{contact.username}</div> */}
            <Avatar color="black" size="2.5rem" radius="10rem">T</Avatar>
            <div className={classes.text}>
                <Text size="sm" lineClamp={1}>some recent text</Text>
                <Text size="xs" lineClamp={1}>seen 1 day ago</Text>
            </div>
        </div>
    )
}

export default Contact