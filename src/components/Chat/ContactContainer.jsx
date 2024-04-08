import { Text } from "@mantine/core";
import Contact from "./Contact";
import styles from "./styles/contactContainerStyles";
// import QueryContainer from "./QueryContainer";
import { useQueryClient } from "@tanstack/react-query";

const ContactContainer = ({ currentChatId, setCurrentChatId }) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData("user");
    const chats = queryClient.getQueryData(["chats"]);

    const contacts = chats?.map(chat => chat.users.find(member => member.id !== user.id));
    const hasChat = chats?.length > 0;


    const classes = styles();
    return (
        <div className={classes.contacts}>
            {/* <QueryContainer setCurrentChatId={setCurrentChatId} /> */}
            {
                hasChat ?
                    contacts.map((contact, index) =>
                        <Contact
                            key={index}
                            contact={contact}
                            currentChatId={currentChatId}
                            setCurrentChatId={setCurrentChatId}
                        />)
                    : <Text ta="center">there's no chat yet</Text>
            }
        </div>
    )
}

export default ContactContainer