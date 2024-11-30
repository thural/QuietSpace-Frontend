import Typography from "@/components/shared/Typography"
import useProfileSettings from "@/services/hook/profile/useProfileSettings"
import TextInput from "../feed/fragments/TextInput"
import BoxStyled from "../shared/BoxStyled"
import FormStyled from "../shared/FormStyled"
import LightButton from "../shared/buttons/LightButton"
import ProfilePhotoModifier from "./ProfilePhotoModifier"
import ErrorComponent from "../shared/errors/ErrorComponent"

const ProfileSettings = () => {

    let settingsData = undefined;

    try {
        settingsData = useProfileSettings();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading settings: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />
    }

    const { settings, handleChange, handleSubmit } = settingsData;


    return (
        <FormStyled style={{ gap: "2rem" }}>
            <Typography type="h3">Profile Settings</Typography>
            <ProfilePhotoModifier />
            <BoxStyled>
                <Typography type="h4">Bio</Typography>
                <TextInput name="bio" minHeight="5rem" handleChange={handleChange} value={settings.bio} />
            </BoxStyled>
            <LightButton
                radius="10px"
                variant="filled"
                color="black"
                handleClick={handleSubmit}
                style={{ width: "8rem", height: "2.5rem", alignSelf: "flex-end" }}
            />
        </FormStyled>
    )
}

export default ProfileSettings