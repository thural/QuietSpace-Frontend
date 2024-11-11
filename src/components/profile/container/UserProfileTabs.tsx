import { ResId } from "@/api/schemas/native/common";
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes";
import Typography from "@/components/shared/Typography";
import { Center, Tabs } from "@mantine/core";
import { PiArrowBendDoubleUpLeft, PiArrowsClockwise, PiClockClockwise, PiNote } from "react-icons/pi";
import UserPostList from "../components/list/UserPostList";

interface UserProfileTabsProps extends GenericWrapper {
    userId: ResId
}

const UserProfileTabs: React.FC<UserProfileTabsProps> = ({ userId }) => {

    return (
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
                <Tabs.Tab value="saved" leftSection={<PiNote size={24} />}>
                    Saves
                </Tabs.Tab>
            </Tabs.List>

            <Center>
                <Tabs.Panel value="timeline">
                    <UserPostList userId={userId} />
                </Tabs.Panel>
                <Tabs.Panel value="replies">
                    <Typography>user replies</Typography>
                </Tabs.Panel>
                <Tabs.Panel value="reposts">
                    <UserPostList userId={userId} isReposts={true} />
                </Tabs.Panel>
                <Tabs.Panel value="saved">
                    <UserPostList userId={userId} isSavedPosts={true} />
                </Tabs.Panel>
            </Center>
        </Tabs>
    )
};

export default UserProfileTabs