import Typography from "@/components/shared/Typography";
import { Center, Tabs } from "@mantine/core";
import { PiClockClockwise, PiIntersect, PiNote } from "react-icons/pi";

const ProfileTabs = () => (
    <Tabs color="black" defaultValue="timeline" style={{ margin: '1rem 0' }}>
        <Tabs.List justify="center" grow>
            <Tabs.Tab value="timeline" leftSection={<PiClockClockwise size={24} />}>
                Timeline
            </Tabs.Tab>
            <Tabs.Tab value="interests" leftSection={<PiIntersect size={24} />}>
                Interests
            </Tabs.Tab>
            <Tabs.Tab value="saved" leftSection={<PiNote size={24} />}>
                Saves
            </Tabs.Tab>
        </Tabs.List>
        <Center>
            <Tabs.Panel value="timeline">
                <Typography>activity timeline</Typography>
            </Tabs.Panel>
            <Tabs.Panel value="interests">
                <Typography>user interests</Typography>
            </Tabs.Panel>
            <Tabs.Panel value="saved">
                <Typography>saved posts</Typography>
            </Tabs.Panel>
        </Center>
    </Tabs>
);

export default ProfileTabs