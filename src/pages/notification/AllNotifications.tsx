import { PagedResponse } from "@/api/schemas/common";
import { NotificationSchema } from "@/api/schemas/notification";
import NotificationList from "@/components/notification/components/list/NotificationList";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { useQueryClient } from "@tanstack/react-query";


const AllNotifications = () => {

    const queryClient = useQueryClient();
    const notificationsPage: PagedResponse<NotificationSchema> | undefined = queryClient.getQueryData(["notifications"]);

    if (notificationsPage === undefined) return <FullLoadingOverlay />;

    console.log("notifications page: ", notificationsPage);

    return (
        <NotificationList notifications={notificationsPage.content} />
    )
}

export default AllNotifications