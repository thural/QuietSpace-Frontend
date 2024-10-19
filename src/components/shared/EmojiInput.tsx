import InputEmoji from "react-input-emoji";
import withForwardedRef from "./hooks/withForwardedRef";

const EmojiInput = ({
    forwardedRef,
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
        ref={forwardedRef}
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

export default withForwardedRef(EmojiInput)