import { UserResponse } from "@/api/schemas/inferred/user";
import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import InputStyled from "@/components/shared/InputStyled";
import UserAvatarPhoto from "@/components/shared/UserAvatarPhoto";
import LightButton from "@/components/shared/buttons/LightButton";
import { ProcedureFn } from "@/types/genericTypes";

interface CreatePostSection {
    user: UserResponse
    handleClick: ProcedureFn
}

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

export default ToggleFormSection