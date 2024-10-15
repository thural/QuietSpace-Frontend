import emoji from "react-easy-emoji"

const EmojiText = ({ text }) => (
    emoji(text).map((element, index) => (
        <p key={index}>{element}</p>
    ))
)

export default EmojiText