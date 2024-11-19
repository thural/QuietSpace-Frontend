import { Tabs, Text } from "@mantine/core";
import { PiArrowBendDoubleUpLeft, PiArrowsClockwise, PiLock, PiTag, PiUserCircle, PiXCircle } from "react-icons/pi";
import DefaultContainer from "@components/shared/DefaultContainer";
import Typography from "@components/shared/Typography";
import { useNavigate } from "react-router-dom";
import ProfileSettings from "./ProfileSettings";


function SettingsContainer() {

    const navigate = useNavigate();

    const redirectToPage = (tabValue: string | null) => {
        if (tabValue !== null) navigate(tabValue);
        console.error("selected settings tab is null");
    };


    return (
        <DefaultContainer>

            <Typography type="h1">settings</Typography>

            <Tabs orientation="vertical" color="black" onChange={redirectToPage} defaultValue="profile" style={{ margin: '1rem 0' }}>

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


                <Tabs.Panel value="profile">
                    <ProfileSettings />
                </Tabs.Panel>
                <Tabs.Panel value="privacy">
                    <Text ta="center">privacy settings</Text>
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

            </Tabs>
        </DefaultContainer>
    )
}

export default SettingsContainer