import InputEmoji from "react-input-emoji";
import withForwardedRefAndErrBoundary from "./hooks/withForwardedRef";
import { GenericWrapperWithRef } from "./types/sharedComponentTypes";

const EmojiInput: React.FC<GenericWrapperWithRef> = ({
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

export default withForwardedRefAndErrBoundary(EmojiInput)