import { UserResponse } from "@/api/schemas/inferred/user";
import BoxStyled from "@/components/shared/BoxStyled";
import FlexStyled from "@/components/shared/FlexStyled";
import InputStyled from "@/components/shared/InputStyled";
import UserAvatar from "@/components/shared/UserAvatar";
import LightButton from "@/components/shared/buttons/LightButton";
import { ProcedureFn } from "@/types/genericTypes";
import { toUpperFirstChar } from "@/utils/stringUtils";

interface CreatePostSection {
    user: UserResponse
    handleClick: ProcedureFn
}

const ToggleFormSection: React.FC<CreatePostSection> = ({ user, handleClick }) => (
    <BoxStyled style={{ margin: "1rem 0" }}>
        <FlexStyled justify="space-between" gap="1rem">
            <UserAvatar radius="10rem" chars={toUpperFirstChar(user.username)} />
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