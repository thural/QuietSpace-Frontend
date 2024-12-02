import useProfileSettings from "@/services/hook/profile/useProfileSettings";
import useStyles from "@/styles/settings/settingContainerStyles";
import { PRIVACY_DESCRIPTION } from "@/utils/dataTemplates";
import DefaultContainer from "@components/shared/DefaultContainer";
import Typography from "@components/shared/Typography";
import { Tabs, Text } from "@mantine/core";
import { PiArrowBendDoubleUpLeft, PiArrowsClockwise, PiLock, PiTag, PiUserCircle, PiXCircle } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import TextInput from "../feed/fragments/TextInput";
import BoxStyled from "../shared/BoxStyled";
import ErrorComponent from "../shared/errors/ErrorComponent";
import SwitchStyled from "../shared/SwitchStyled";
import ProfilePhotoModifier from "./ProfilePhotoModifier";
import SettingsPanel from "./SettingsPanel";

function SettingsContainer() {

    const classes = useStyles();
    const navigate = useNavigate();

    const redirectToPage = (tabValue: string | null) => {
        if (tabValue !== null) navigate(tabValue);
        console.error("selected settings tab is null");
    };

    let settingsData = undefined;

    try {
        settingsData = useProfileSettings();
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading settings: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />
    }

    const { settings, isPending, handleChange, handleSwitchChange, handleSubmit } = settingsData;


    return (
        <DefaultContainer>
            <Typography type="h2">settings</Typography>
            <Tabs orientation="vertical" color="black" onChange={redirectToPage} defaultValue="profile">
                <Tabs.List justify="center" grow>
                    <Tabs.Tab value="profile" leftSection={<PiUserCircle size={24} />}>
                        Profile
                    </Tabs.Tab>
                    <Tabs.Tab value="privacy" leftSection={<PiLock size={24} />}>
                        Privacy
                    </Tabs.Tab>
                    <Tabs.Tab value="mentions" leftSection={<PiTag size={24} />}>
                        Mentions
                    </Tabs.Tab>
                    <Tabs.Tab value="sharing" leftSection={<PiArrowsClockwise size={24} />}>
                        Sharing
                    </Tabs.Tab>
                    <Tabs.Tab value="replies" leftSection={<PiArrowBendDoubleUpLeft size={24} />}>
                        Replies
                    </Tabs.Tab>
                    <Tabs.Tab value="blocking" leftSection={<PiXCircle size={24} />}>
                        Blocking
                    </Tabs.Tab>
                </Tabs.List>

                <BoxStyled className={classes.panel}>

                    <Tabs.Panel value="profile">
                        <SettingsPanel isPending={isPending} label="Profile Settings" handleSubmit={handleSubmit}>
                            <ProfilePhotoModifier />
                            <BoxStyled>
                                <Typography type="h4">Bio</Typography>
                                <TextInput name="bio" minHeight="5rem" handleChange={handleChange} value={settings.bio} />
                            </BoxStyled>
                        </SettingsPanel>
                    </Tabs.Panel>

                    <Tabs.Panel value="privacy">
                        <SettingsPanel isPending={isPending} label="Privacy Settings" handleSubmit={handleSubmit}>
                            <SwitchStyled
                                color="blue"
                                name="isPrivateAccount"
                                labelPosition="left"
                                label="private account"
                                description={PRIVACY_DESCRIPTION}
                                size="md"
                                checked={settings.isPrivateAccount}
                                onChange={handleSwitchChange}
                            />
                        </SettingsPanel>
                    </Tabs.Panel>

                    <Tabs.Panel value="mentions">
                        <Text ta="center">mention settings</Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="sharing">
                        <Text ta="center">sharing settings</Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="replies">
                        <Text ta="center">profile settings</Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="blocking">
                        <Text ta="center">blocking settings</Text>
                    </Tabs.Panel>
                </BoxStyled>
            </Tabs>
        </DefaultContainer>
    )
}

export default SettingsContainer