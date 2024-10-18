import BoxStyled from "@shared/BoxStyled";
import FlexStyled from "@shared/FlexStyled";
import InputStyled from "@shared/InputStyled";
import UserAvatar from "@shared/UserAvatar";
import LightButton from "@shared/buttons/LightButton";
import { toUpperFirstChar } from "@utils/stringUtils";

const CreatePostSection = ({ user, toggleCreatePostForm }) => (
    <BoxStyled style={{ margin: "1rem 0" }}>
        <FlexStyled justify="space-between" gap="1rem">
            <UserAvatar radius="10rem" chars={toUpperFirstChar(user.username)} />
            <InputStyled
                variant="unstyled"
                style={{ width: "100%" }}
                placeholder="start a topic..."
                onClick={toggleCreatePostForm}
            />
            <LightButton name="post" handleClick={toggleCreatePostForm} />
        </FlexStyled>
    </BoxStyled>
);

export default CreatePostSection