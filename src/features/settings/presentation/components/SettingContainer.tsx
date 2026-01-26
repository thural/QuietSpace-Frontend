import { useProfileSettings } from "@features/settings/application";
import { Panel } from "../styles/settingContainerStyles";
import { PRIVACY_DESCRIPTION } from "@/shared/utils/dataTemplates";
import DefaultContainer from "@/shared/DefaultContainer";
import Typography from "@/shared/Typography";
import { Tabs } from "@/shared/ui/components";
import { Text } from "@/shared/ui/components";
import { PiArrowBendDoubleUpLeft, PiArrowsClockwise, PiLock, PiTag, PiUserCircle, PiXCircle } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import TextInput from "@/features/feed/presentation/components/fragments/TextInput";
import { Container } from "@/shared/ui/components/layout/Container";
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
            <Tabs color="black" onChange={redirectToPage} defaultValue="profile">
                <Tabs.List justify="center" grow>
                    <Tabs.Tab value="profile" label="Profile" leftSection={<PiUserCircle size={24} />}>
                    </Tabs.Tab>
                    <Tabs.Tab value="privacy" label="Privacy" leftSection={<PiLock size={24} />}>
                    </Tabs.Tab>
                    <Tabs.Tab value="mentions" label="Mentions" leftSection={<PiTag size={24} />}>
                    </Tabs.Tab>
                    <Tabs.Tab value="sharing" label="Sharing" leftSection={<PiArrowsClockwise size={24} />}>
                    </Tabs.Tab>
                    <Tabs.Tab value="replies" label="Replies" leftSection={<PiArrowBendDoubleUpLeft size={24} />}>
                    </Tabs.Tab>
                    <Tabs.Tab value="blocking" label="Blocking" leftSection={<PiXCircle size={24} />}>
                    </Tabs.Tab>
                </Tabs.List>

                <Panel>
                    <Tabs.Panel value="profile">
                        <SettingsPanel isPending={isPending} label="Profile Settings" handleSubmit={handleSubmit}>
                            <ProfilePhotoModifier /> {/* Component for modifying the profile photo */}
                            <Container>
                                <Typography type="h4">Bio</Typography>
                                <TextInput
                                    name="bio"
                                    placeholder={PRIVACY_DESCRIPTION}
                                    handleChange={handleChange}
                                    value={settings.bio}
                                /> {/* Input for bio */}
                            </Container>
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
                </Panel>
            </Tabs>
        </DefaultContainer>
    );
}

export default SettingsContainer;