import React from "react"
import styles from "./styles/messageStyles"
import {useSelector} from "react-redux"
import {fetchDeleteMessage} from "../../api/chatRequests";
import {MESSAGE_PATH} from "../../constants/ApiPath";

const Message = ({message}) => {

    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer)
    const {id, sender, text, reactions} = message;
    const senderName = sender.username;

    const handleDeleteMessage = async () => {
        try {
            const response = await fetchDeleteMessage(MESSAGE_PATH, auth["token"], message.id);
            if (response.ok) console.log("message has been deleted"); // TODO create a dispatch method to update the store
        } catch (error) {
            console.log("error deleting the message: ", error)
        }
    }

    const appliedStyle = sender.username !== user.username ? {marginRight: "auto"} : {
        marginLeft: "auto",
        backgroundColor: '#f1f1f1'
    };

    const classes = styles();
    return (
        <div id={id} className={classes.message} style={appliedStyle}>
            <div className={classes.sender}>{senderName}</div>
            {
                sender.username === user.username &&
                <div className={classes.delete} onClick={handleDeleteMessage}>delete</div>
            }
            <div className={classes.text}><p>{text}</p></div>
        </div>
    )

}

export default Message