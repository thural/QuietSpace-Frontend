import {useState} from "react"
import Message from "./Message"
import styles from "./styles/messageContainerStyles"
import {useDispatch, useSelector} from 'react-redux'
import {addMessage} from "../../redux/chatReducer"
import {fetchCreateMessage} from "../../api/chatRequests";
import {MESSAGE_PATH} from "../../constants/ApiPath";

const MessageContainer = () => {

    const chats = useSelector(state => state.chatReducer);
    const auth = useSelector(state => state.authReducer);
    const dispatch = useDispatch();

    const messages = chats[0].messages;
    const [messageData, setMessageData] = useState({text: ''});

    const handleInputChange = (event) => {
        const {name, value} = event.target
        setMessageData({...messageData, [name]: value})
    }

    const sendMessage = async (messageData) => {
        const mockMessage = {
            chatId: "77577489-0a18-4946-9d09-e9c70533d405",
            senderId: "1dbaf467-3e21-4d0a-b1ad-d8ee2c766c4c",
            text: messageData.text
        }

        const response = await fetchCreateMessage(MESSAGE_PATH, mockMessage, auth.token);
    }

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(messageData).then(() => console.log("message sent"));
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