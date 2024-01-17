import {useState} from "react"
import Message from "./Message"
import styles from "./styles/messageContainerStyles"
import {useDispatch, useSelector} from 'react-redux'
import {fetchCreateMessage} from "../../api/chatRequests";
import {MESSAGE_PATH} from "../../constants/ApiPath";
import {addMessage} from "../../redux/chatReducer";

const MessageContainer = ({currentChatId}) => {
    const auth = useSelector(state => state.authReducer);
    const chats = useSelector(state => state.chatReducer);
    const dispatch = useDispatch();

    const messages = chats.find(chat => chat.id === currentChatId).messages > 0 ?
        chats.find(chat => chat.id === currentChatId).messages
        : [];

    const senderId = auth["userId"];

    console.log("current chat id: ", currentChatId);

    const [messageData, setMessageData] = useState({currentChatId, senderId, text: ''});

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setMessageData({...messageData, [name]: value})
    }

    const handleSendMessage = async () => {
        const response = await fetchCreateMessage(MESSAGE_PATH, messageData, auth["token"]);
        let responseData = await response.json();
        responseData = {...responseData, "sender": {"username": responseData.username}};
        dispatch(addMessage({currentChatId, messageData: responseData}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (messageData.text.length === 0) return;
        handleSendMessage(messageData).then(() => console.log("message sent"));
        setMessageData({...messageData, text: ''});
    }

    const classes = styles();

    return (
        <div className={classes.chatboard}>

            <div className={classes.messages}>
                {
                    messages.map(message =>
                        <Message
                            key={message.id}
                            message={message}
                            currentChatId={currentChatId}
                        />)
                }
            </div>

            <div className={classes.inputSection}>
                <form className={classes.chatInput} onSubmit={handleSubmit}>
                    <input
                        className='input'
                        type='text'
                        name='text'
                        placeholder="Write a message ..."
                        maxLength="128"
                        value={messageData.message}
                        onChange={handleInputChange}
                    />
                    <button className={classes.submitBtn} type='submit'> send</button>
                </form>
            </div>
        </div>

    )
}

export default MessageContainer