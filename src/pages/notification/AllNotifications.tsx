import { PagedResponse } from "@/api/schemas/common";
import { NotificationResponse } from "@/api/schemas/notification";
import NotificationList from "@/components/notification/components/list/NotificationList";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { useQueryClient } from "@tanstack/react-query";


const AllNotifications = () => {

    const queryClient = useQueryClient();
    const notificationsPage: PagedResponse<NotificationResponse> | undefined = queryClient.getQueryData(["notifications"]);

    if (notificationsPage === undefined) return <FullLoadingOverlay />;

    console.log("notifications page: ", notificationsPage);

    return (
        <NotificationList notifications={notificationsPage.content} />
    )
}

export default AllNotifications