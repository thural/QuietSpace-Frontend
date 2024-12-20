import { ResId } from "@/api/schemas/native/common";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import Typography from "@/components/shared/Typography";
import { Tabs } from "@mantine/core";
import { PiArrowBendDoubleUpLeft, PiArrowsClockwise, PiClockClockwise } from "react-icons/pi";
import UserPostList from "../list/UserPostList";


interface ProfileTabsProps extends GenericWrapper {
    userId: ResId
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ userId }) => (
    <Tabs color="black" defaultValue="timeline" style={{ margin: '1rem 0' }}>
        <Tabs.List justify="center" grow>
            <Tabs.Tab value="timeline" leftSection={<PiClockClockwise size={24} />}>
                Timeline
            </Tabs.Tab>
            <Tabs.Tab value="replies" leftSection={<PiArrowBendDoubleUpLeft size={24} />}>
                Replies
            </Tabs.Tab>
            <Tabs.Tab value="reposts" leftSection={<PiArrowsClockwise size={24} />}>
                Reposts
            </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="timeline">
            <UserPostList userId={userId} />
        </Tabs.Panel>
        <Tabs.Panel value="replies">
            <Typography>user replies</Typography>
        </Tabs.Panel>
        <Tabs.Panel value="reposts">
            <UserPostList userId={userId} isReposts={true} />
        </Tabs.Panel>
    </Tabs>
);

export default ProfileTabs