import { NotificationResponse } from "@/api/schemas/inferred/notification";
import { NotificationType } from "@/api/schemas/native/notification";
import InfinateScrollContainer from "@/components/shared/InfinateScrollContainer";
import { useGetNotifications } from "@/services/data/useNotificationData";
import { Category, pickNotificationFilter } from "@/utils/notificationUtils";
import Typography from "@components/shared/Typography";
import { Center } from "@mantine/core";
import { useParams } from "react-router-dom";
import CommentNotification from "../fragments/CommentNotification";
import FollowNotification from "../fragments/FollowNotification";
import PostNotification from "../fragments/PostNotification";

const NotificationList = () => {

    const { category }: { category: Category } = useParams();

    const { data: pagedData, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetNotifications();
    const content: Array<NotificationResponse> = pagedData.pages.flatMap((page) => page.content);

    if (content.length == 0) return <Center>
        <Typography ta="center">You have no Notifications yet</Typography>
    </Center>;


    const appliedFilter = pickNotificationFilter(category);
    const notifications = content.filter(appliedFilter);


    const getNotificationCard = (notification: NotificationResponse) => {
        const { type, id } = notification;

        const {
            FOLLOW_REQUEST,
            POST_REACTION,
            COMMENT,
            COMMENT_REACTION,
            COMMENT_REPLY,
            MENTION,
            REPOST
        } = NotificationType;

        switch (type) {
            case COMMENT_REACTION:
                return <CommentNotification key={id} notification={notification} />;
            case COMMENT_REPLY:
                return <CommentNotification key={id} notification={notification} />;
            case FOLLOW_REQUEST:
                return <FollowNotification key={id} notification={notification} />;
            case POST_REACTION:
                return <PostNotification key={id} notification={notification} />;
            case COMMENT:
                return <PostNotification key={id} notification={notification} />;
            case REPOST:
                return <PostNotification key={id} notification={notification} />;
            case MENTION:
                return <PostNotification key={id} notification={notification} />;
            default: return null;
        }
    }




    return (
        <InfinateScrollContainer
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
        >
            {notifications.map(notification => getNotificationCard(notification))}
        </InfinateScrollContainer>
    );
}

export default NotificationList