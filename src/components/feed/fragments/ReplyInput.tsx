import { ResId } from "@/api/schemas/inferred/common";
import Conditional from "@/components/shared/Conditional";
import EmojiInput from "@/components/shared/EmojiInput";
import FlexStyled from "@/components/shared/FlexStyled";
import FormStyled from "@/components/shared/FormStyled";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes";
import { RefObject } from "react";

/**
 * Props for the ReplyInput component.
 * 
 * @interface ReplyInputProps
 * @extends GenericWrapperWithRef
 * @property {RefObject<HTMLInputElement>} inputRef - Reference to the input element.
 * @property {string} [avatarPlaceholder] - Placeholder for the user avatar.
 * @property {ConsumerFn} handleChange - Function to handle changes in the input field.
 * @property {ConsumerFn} handleSubmit - Function to handle form submission.
 * @property {boolean} [isWithAvatar] - Indicates whether to display the user avatar.
 * @property {string} [avatarSize] - Size of the user avatar.
 * @property {string} [placeholder] - Placeholder text for the input field.
 * @property {string} [borderColor] - Border color of the input field.
 * @property {string} inputValue - Current value of the input field.
 * @property {ResId} userId - The ID of the user whose avatar is to be displayed.
 */
export interface ReplyInputProps extends GenericWrapperWithRef {
    inputRef: RefObject<HTMLInputElement>;
    avatarPlaceholder?: string;
    handleChange: ConsumerFn;
    handleSubmit: ConsumerFn;
    isWithAvatar?: boolean;
    avatarSize?: string;
    placeholder?: string;
    borderColor?: string;
    inputValue: string;
    userId: ResId;
}

/**
 * ReplyInput component.
 * 
 * This component provides an input field for users to type replies or comments. It can
 * optionally display the user's avatar. The input supports emoji input and handles
 * both change and submission events.
 * 
 * @param {ReplyInputProps} props - The component props.
 * @returns {JSX.Element} - The rendered ReplyInput component.
 */
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
            <FormStyled style={{ width: "100%" }}>
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
    );
};

export default ReplyInput;