import { Text } from "@mantine/core";
import Contact from "./Contact";
import styles from "./styles/contactContainerStyles";
import QueryContainer from "./QueryContainer";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../../hooks/zustand";

const ContactContainer = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const chats = queryClient.getQueryData(["chats"]);

    const { data: storeChatData } = useChatStore();
    const activeChatId = storeChatData.activeChatId;
    const { setActiveChatId } = useChatStore();


    const contacts = chats?.map(chat => chat.users.find(member => member.id !== user.id));


    const classes = styles();
    return (
        <div className={classes.contacts}>
            <QueryContainer setCurrentChatId={setActiveChatId} />
            {
                (chats?.length > 0) ?
                    contacts.map((contact, index) =>
                        <Contact
                            key={index}
                            contact={contact}
                            currentChatId={activeChatId}
                            setCurrentChatId={setActiveChatId}
                        />)
                    : <Text ta="center">there's no chat yet</Text>
            }
        </div>
    )
}

export default ContactContainer