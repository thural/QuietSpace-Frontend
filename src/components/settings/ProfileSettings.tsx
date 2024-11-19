import BoxStyled from "@/components/shared/BoxStyled"
import TextInputStyled from "@/components/shared/TextInputStyled"
import Typography from "@/components/shared/Typography"

const ProfileSettings = () => {
    return (
        <BoxStyled>
            <Typography type="h3">Profile Settings</Typography>
            <Typography type="h1">Bio</Typography>
            <TextInputStyled value={"some user bio to be fetched"} />
        </BoxStyled>
    )
}

export default ProfileSettings