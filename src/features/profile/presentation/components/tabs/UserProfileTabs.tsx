import { ResId } from "@/shared/api/models/commonNative";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { Tabs } from "@/shared/ui/components";
import { PiArrowBendDoubleUpLeft, PiArrowsClockwise, PiClockClockwise, PiNote } from "react-icons/pi";
import UserPostList from "../list/UserPostList";

interface UserProfileTabsProps extends GenericWrapper {
    userId: ResId
}

const UserProfileTabs: React.FC<UserProfileTabsProps> = ({ userId }) => {

    return (
        <Tabs color="black" defaultValue="timeline" style={{ margin: '1rem 0' }}>
            <Tabs.List justify="center" grow>
                <Tabs.Tab value="timeline" label="Timeline" leftSection={<PiClockClockwise size={24} />}>
                </Tabs.Tab>
                <Tabs.Tab value="replies" label="Replies" leftSection={<PiArrowBendDoubleUpLeft size={24} />}>
                </Tabs.Tab>
                <Tabs.Tab value="reposts" label="Reposts" leftSection={<PiArrowsClockwise size={24} />}>
                </Tabs.Tab>
                <Tabs.Tab value="saved" label="Saves" leftSection={<PiNote size={24} />}>
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="timeline">
                <UserPostList userId={userId} />
            </Tabs.Panel>
            <Tabs.Panel value="replies">
                <UserPostList userId={userId} isRepliedPosts={true} />
            </Tabs.Panel>
            <Tabs.Panel value="reposts">
                <UserPostList userId={userId} isReposts={true} />
            </Tabs.Panel>
            <Tabs.Panel value="saved">
                <UserPostList userId={userId} isSavedPosts={true} />
            </Tabs.Panel>
        </Tabs>
    )
};

export default UserProfileTabs