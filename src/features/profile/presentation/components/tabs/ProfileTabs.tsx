import { ResId } from "@/shared/api/models/commonNative";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import Typography from "@/shared/Typography";
import { Tabs } from "@/shared/ui/components";
import { PiArrowBendDoubleUpLeft, PiArrowsClockwise, PiClockClockwise } from "react-icons/pi";
import UserPostList from "../list/UserPostList";


interface ProfileTabsProps extends GenericWrapper {
    userId: ResId
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ userId }) => (
    <Tabs color="black" defaultValue="timeline" style={{ margin: '1rem 0' }}>
        <Tabs.List justify="center" grow>
            <Tabs.Tab value="timeline" label="Timeline" leftSection={<PiClockClockwise size={24} />}>
            </Tabs.Tab>
            <Tabs.Tab value="replies" label="Replies" leftSection={<PiArrowBendDoubleUpLeft size={24} />}>
            </Tabs.Tab>
            <Tabs.Tab value="reposts" label="Reposts" leftSection={<PiArrowsClockwise size={24} />}>
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