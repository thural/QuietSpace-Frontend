import { Page } from "@/api/schemas/inferred/common";
import { Notification } from "@/api/schemas/inferred/notification";
import NotificationList from "@/components/notification/components/list/NotificationList";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { useQueryClient } from "@tanstack/react-query";


const AllNotifications = () => {

    const queryClient = useQueryClient();
    const notificationsPage: Page<Notification> | undefined = queryClient.getQueryData(["notifications"]);
    if (notificationsPage === undefined) return <FullLoadingOverlay />;
    return <NotificationList notifications={notificationsPage.content} />
}

export default AllNotifications