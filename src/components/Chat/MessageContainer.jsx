import {useState} from "react"
import Message from "./Message"
import styles from "./styles/messageContainerStyles"
import {useDispatch, useSelector} from 'react-redux'
import {fetchCreateMessage} from "../../api/chatRequests";
import {MESSAGE_PATH} from "../../constants/ApiPath";
import {addMessage} from "../../redux/chatReducer";

const MessageContainer = ({currentChat}) => {
    const auth = useSelector(state => state.authReducer);
    const dispatch = useDispatch();

    const messages = currentChat.messages;
    const chatId = currentChat.id;
    const senderId = currentChat.users[0].id;

    const [messageData, setMessageData] = useState({chatId, senderId, text: ''});

    const handleInputChange = (event) => {
        const {name, value} = event.target
        setMessageData({...messageData, [name]: value})
    }

    const handleSendMessage = async () => {
        const response = await fetchCreateMessage(MESSAGE_PATH, messageData, auth["token"]);
        let responseData = await response.json();
        responseData = {...responseData, "sender": {"username": responseData.username}};
        dispatch(addMessage({currentChatId: currentChat.id, messageData: responseData}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSendMessage(messageData).then(() => console.log("message sent"));
        setMessageData({...messageData, text: ''});
    }

    const classes = styles();

    return (
        <div className={classes.chatboard}>

            <div className={classes.messages}>
                {
                    messages.map(message => <Message key={message.id} message={message}/>)
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