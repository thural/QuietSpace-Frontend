import { ResId } from "@/api/schemas/inferred/common";
import Conditional from "@/components/shared/Conditional";
import EmojiInput from "@/components/shared/EmojiInput";
import FlexStyled from "@/components/shared/FlexStyled";
import FormStyled from "@/components/shared/FormStyled";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes";
import { RefObject } from "react";

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
    userId: ResId,
}

const ReplyInput: React.FC<ReplyInputProps> = ({
    inputRef,
    inputValue,
    handleChange,
    handleSubmit,
    isWithAvatar = true,
    userId,
    placeholder = "type a comment",
    borderColor = "transparent",
}) => {

    return (
        <FlexStyled onClick={(e: Event) => e.stopPropagation()} style={{ alignItems: 'center' }}>
            <Conditional isEnabled={isWithAvatar}>
                <UserAvatarPhoto size="2rem" userId={userId} />
            </Conditional>
            <FormStyled>
                <EmojiInput
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