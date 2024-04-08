import { Avatar, Text } from "@mantine/core";
import styles from "./styles/contactStyles";
import { useQueryClient } from "@tanstack/react-query";

const Contact = ({ contact, currentChatId, setCurrentChatId }) => {

    console.log("current chat id in contact: ", currentChatId);

    const queryClient = useQueryClient();
    const chats = queryClient.getQueryData(["chats"]);
    console.log("chats in contact component: ", chats);
    const userOfCurrentChat = chats.find(chat => chat.id === currentChatId).users[1].id;

    console.log("chats in contact component: ", chats);
    console.log("current contact id: ", contact.id);

    const chatOfThisContact = chats?.find(chat => chat.users.some(user => user.id === contact.id));
    const isCurrentChatEmpty = chatOfThisContact?.messages.length === 0;

    console.log("chat of current contact: ", chatOfThisContact);
    console.log("is current chat is empty?: ", isCurrentChatEmpty);

    const recentText = isCurrentChatEmpty ? "" : Array.from(chatOfThisContact.messages).pop().text;
    const backgroundColor = userOfCurrentChat === contact.id ? '#e3e3e3' : 'white';

    const handleClick = () => {
        setCurrentChatId(chatOfThisContact["id"]);
    }

    const classes = styles();

    return (
        <div id={contact.id} className={classes.contact} onClick={handleClick} style={{ backgroundColor }}>
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