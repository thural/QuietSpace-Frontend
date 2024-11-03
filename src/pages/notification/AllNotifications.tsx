import notificationQueries from "@/api/queries/notificationQueries";
import { Page } from "@/api/schemas/inferred/common";
import { Notification } from "@/api/schemas/inferred/notification";
import NotificationList from "@/components/notification/components/list/NotificationList";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";


const AllNotifications = () => {

    const { getNotificationsCache } = notificationQueries();

    const notificationsPage: Page<Notification> | undefined = getNotificationsCache();
    if (notificationsPage === undefined) return <FullLoadingOverlay />;
    return <NotificationList notifications={notificationsPage.content} />
}

export default AllNotifications