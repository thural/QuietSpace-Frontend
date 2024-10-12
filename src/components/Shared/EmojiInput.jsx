import InputEmoji from "react-input-emoji";

const EmojiInput = ({
    isEnabled = true,
    value,
    onChange,
    maxLength = "255",
    fontSize = 15,
    onEnter,
    theme = "light",
    borderColor = "#FFFFFF",
    ...props
}) => (
    <InputEmoji
        value={value}
        onChange={onChange}
        fontSize={fontSize}
        maxLength={maxLength}
        cleanOnEnter
        buttonElement
        borderColor={borderColor}
        onEnter={onEnter}
        theme={theme}
        enabled={isEnabled}
        {...props}
    />
);

export default EmojiInput