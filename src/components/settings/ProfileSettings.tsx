import { getSignedUserElseThrow } from "@/api/queries/userQueries"
import { ProfileSettingsRequest, UserProfileResponse } from "@/api/schemas/inferred/user"
import Typography from "@/components/shared/Typography"
import { useSaveProfileSettings } from "@/services/data/useUserData"
import { useState } from "react"
import TextInput from "../feed/fragments/TextInput"
import BoxStyled from "../shared/BoxStyled"
import FormStyled from "../shared/FormStyled"
import LightButton from "../shared/buttons/LightButton"
import ProfilePhotoModifier from "./ProfilePhotoModifier"

const ProfileSettings = () => {

    const user: UserProfileResponse = getSignedUserElseThrow();
    const saveSettings = useSaveProfileSettings(user.id);
    const [settings, setSetting] = useState<ProfileSettingsRequest>(user.settings);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const { name, value }: { name: string; value: string } = target;
        setSetting({ ...settings, [name]: value });
    };

    const handleSave = () => saveSettings.mutate(settings);


    return (
        <FormStyled style={{ gap: "2rem" }}>
            <Typography type="h3">Profile Settings</Typography>
            <ProfilePhotoModifier />
            <BoxStyled>
                <Typography type="h4">Bio</Typography>
                <TextInput minHeight="5rem" handleChange={handleChange} value={settings.bio} />
            </BoxStyled>
            <LightButton
                radius="10px"
                variant="filled"
                color="black"
                handleClick={handleSave}
                style={{ width: "8rem", height: "2.5rem", alignSelf: "flex-end" }}
            />
        </FormStyled>
    )
}

export default ProfileSettings