import { UserResponse } from "@/features/profile/data/models/user";
import { Container } from "../../../../../shared/ui/components";
import FlexStyled from "@/shared/FlexStyled";
import { Input } from "../../../../../shared/ui/components";
import UserAvatarPhoto from "@/shared/UserAvatarPhoto";
import { Button } from "../../../../../shared/ui/components";
import { ProcedureFn } from "@/shared/types/genericTypes";

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
    <Container style={{ margin: "1rem 0" }}>
        <FlexStyled justify="space-between" gap="1rem">
            <UserAvatarPhoto userId={user.id} />
            <Input
                variant="unstyled"
                style={{ width: "100%" }}
                placeholder="start a topic..."
                onClick={handleClick}
            />
            <Button variant="light" name="post" handleClick={handleClick} />
        </FlexStyled>
    </Container>
);

export default ToggleFormSection;