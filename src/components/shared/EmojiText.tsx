import emoji from "react-easy-emoji"

const EmojiText = ({ text }: { text: string }) => (
    emoji(text).map((element: string, index: number) => (
        <p key={index}>{element}</p>
    ))
)

export default EmojiText