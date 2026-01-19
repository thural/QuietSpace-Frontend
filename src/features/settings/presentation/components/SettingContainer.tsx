import useProfileSettings from "@/services/hook/profile/useProfileSettings";
import useStyles from "@/styles/settings/settingContainerStyles";
import { PRIVACY_DESCRIPTION } from "@/utils/dataTemplates";
import DefaultContainer from "@/shared/DefaultContainer";
import Typography from "@/shared/Typography";
import { Tabs, Text } from "@mantine/core";
import { PiArrowBendDoubleUpLeft, PiArrowsClockwise, PiLock, PiTag, PiUserCircle, PiXCircle } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import TextInput from "@/features/feed/presentation/components/fragments/TextInput";
import BoxStyled from "@/shared/BoxStyled";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import SwitchStyled from "@/shared/SwitchStyled";
import ProfilePhotoModifier from "./ProfilePhotoModifier";
import SettingsPanel from "./SettingsPanel";

/**
 * SettingsContainer component.
 * 
 * This component provides a settings interface for the user, including profile, privacy, mentions,
 * sharing, replies, and blocking settings. It utilizes hooks to fetch and manage user settings,
 * and handles errors gracefully by displaying an error component if necessary.
 * 
 * @returns {JSX.Element} - The rendered SettingsContainer component.
 */
function SettingsContainer() {
    const classes = useStyles(); // Get styles for the component
    const navigate = useNavigate(); // Hook for navigation

    /**
     * Redirects to the selected settings tab.
     * 
     * @param {string | null} tabValue - The value of the tab that was selected.
     */
    const redirectToPage = (tabValue: string | null) => {
        if (tabValue !== null) {
            navigate(tabValue); // Navigate to the selected tab
        } else {
            console.error("selected settings tab is null"); // Log error if tab value is null
        }
    };

    let settingsData = undefined;

    // Attempt to fetch user profile settings using a custom hook
    try {
        settingsData = useProfileSettings(); // Fetch settings data
    } catch (error: unknown) {
        console.error(error);
        const errorMessage = `error loading settings: ${(error as Error).message}`;
        return <ErrorComponent message={errorMessage} />; // Display error component if fetching fails
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
                            <ProfilePhotoModifier /> {/* Component for modifying the profile photo */}
                            <BoxStyled>
                                <Typography type="h4">Bio</Typography>
                                <TextInput
                                    name="bio"
                                    minHeight="5rem"
                                    handleChange={handleChange}
                                    value={settings.bio}
                                /> {/* Input for bio */}
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
                                description={PRIVACY_DESCRIPTION} // Description for privacy setting
                                size="md"
                                checked={settings.isPrivateAccount}
                                onChange={handleSwitchChange} // Handle switch changes
                            />
                        </SettingsPanel>
                    </Tabs.Panel>

                    <Tabs.Panel value="mentions">
                        <Text ta="center">mention settings</Text> {/* Placeholder for mention settings */}
                    </Tabs.Panel>
                    <Tabs.Panel value="sharing">
                        <Text ta="center">sharing settings</Text> {/* Placeholder for sharing settings */}
                    </Tabs.Panel>
                    <Tabs.Panel value="replies">
                        <Text ta="center">profile settings</Text> {/* Placeholder for replies settings */}
                    </Tabs.Panel>
                    <Tabs.Panel value="blocking">
                        <Text ta="center">blocking settings</Text> {/* Placeholder for blocking settings */}
                    </Tabs.Panel>
                </BoxStyled>
            </Tabs>
        </DefaultContainer>
    );
}

export default SettingsContainer;