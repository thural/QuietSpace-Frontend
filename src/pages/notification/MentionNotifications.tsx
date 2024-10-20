import { ContentResponse } from "@/api/schemas/common";
import { NotificationResponse, NotificationType } from "@/api/schemas/notification";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { getEnumValueFromString } from "@/utils/enumUtils";
import NotificationList from "@components/notification/components/list/NotificationList";
import { useQueryClient } from "@tanstack/react-query";


const MentionNotifications = () => {
    const queryClient = useQueryClient();
    const content: ContentResponse<NotificationResponse> | undefined = queryClient.getQueryData(["notifications"]);

    if (content === undefined) return <FullLoadingOverlay />

    const notifications = content?.filter(n => getEnumValueFromString(NotificationType, n.type) === NotificationType.MENTION)

    return (
        <NotificationList notifications={notifications} />
    )
}

export default MentionNotifications