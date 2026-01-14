import { UserResponse } from "@/api/schemas/inferred/user";
import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import InputStyled from "@/components/shared/InputStyled";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import LightButton from "@/components/shared/buttons/LightButton";
import { ProcedureFn } from "@/types/genericTypes";

/**
 * Props for the ToggleFormSection component.
 * 
 * @interface CreatePostSection
 * @property {UserResponse} user - The user data object containing information about the user.
 * @property {ProcedureFn} handleClick - Function to handle click events on the input and button.
 */
interface CreatePostSection {
    user: UserResponse;
    handleClick: ProcedureFn;
}

/**
 * ToggleFormSection component.
 * 
 * This component provides a UI section for creating a new post. It displays the user's avatar,
 * an input field for starting a topic, and a button to submit the post. The input field and button
 * both trigger the provided click handler when interacted with.
 * 
 * @param {CreatePostSection} props - The component props.
 * @returns {JSX.Element} - The rendered ToggleFormSection component.
 */
const ToggleFormSection: React.FC<CreatePostSection> = ({ user, handleClick }) => (
    <BoxStyled style={{ margin: "1rem 0" }}>
        <FlexStyled justify="space-between" gap="1rem">
            <UserAvatarPhoto userId={user.id} />
            <InputStyled
                variant="unstyled"
                style={{ width: "100%" }}
                placeholder="start a topic..."
                onClick={handleClick}
            />
            <LightButton name="post" handleClick={handleClick} />
        </FlexStyled>
    </BoxStyled>
);

export default ToggleFormSection;