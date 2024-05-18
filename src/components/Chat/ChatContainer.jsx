import { Text } from "@mantine/core";
import Contact from "./Contact";
import styles from "./styles/contactContainerStyles";
import QueryContainer from "./QueryContainer";
import { useQueryClient } from "@tanstack/react-query"; 
import {useMemo} from "react";

const ContactContainer = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const chats = queryClient.getQueryData(["chats"]);



    const contactIds = useMemo(() => chats?.map(chat => chat.userIds.find(memberId => memberId !== user.id)), [chats]);







    const classes = styles();
    return (
        <div className={classes.contacts}>
            <QueryContainer />
            {
                (chats?.length > 0) ?
                    contactIds.map((contactId, index) =>
                        <Contact
                            key={index}
                            contactId={contactId}
                        />)
                    : <Text ta="center">there's no chat yet</Text>
            }
        </div>
    )
}

export default ContactContainer