import Conditional from "@/components/shared/Conditional";
import EmojiInput from "@/components/shared/EmojiInput";
import FlexStyled from "@/components/shared/FlexStyled";
import FormStyled from "@/components/shared/FormStyled";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes";
import { RefObject } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    replyWrapper: {
        alignItems: 'center',
    },
    replyInput: {
        width: '100%',
        border: 'none',
        height: 'auto',
        resize: 'none',
        outline: 'none',
        padding: '10px',
        overflow: 'hidden',
        maxHeight: '200px',
        borderRadius: '4px',
        boxSizing: 'border-box',
        backgroundColor: 'transparent'
    },
});

export interface ReplyInputProps extends GenericWrapperWithRef {
    inputRef: RefObject<HTMLInputElement>,
    avatarPlaceholder?: string,
    handleChange: ConsumerFn,
    handleSubmit: ConsumerFn,
    isWithAvatar?: boolean,
    avatarSize?: string,
    placeholder?: string,
    borderColor?: string,
    inputValue: string,
    userId: string,
}

const ReplyInput: React.FC<ReplyInputProps> = ({
    inputRef,
    inputValue,
    handleChange,
    handleSubmit,
    isWithAvatar = true,
    userId,
    avatarPlaceholder = "",
    avatarSize = "10rem",
    placeholder = "type a comment",
    borderColor = "transparent",
}) => {

    const classes = useStyles();

    return (
        <FlexStyled onClick={(e: Event) => e.stopPropagation()} className={classes.replyWrapper}>
            <Conditional isEnabled={isWithAvatar}>
                <UserAvatarPhoto size="2rem" userId={userId} />
            </Conditional>
            <FormStyled>
                <EmojiInput
                    className={classes.replyInput}
                    value={inputValue}
                    onChange={handleChange}
                    cleanOnEnter
                    buttonElement
                    onEnter={handleSubmit}
                    placeholder={placeholder}
                    inputRef={inputRef}
                    borderColor={borderColor}
                />
            </FormStyled>
        </FlexStyled>
    )
};

export default ReplyInput