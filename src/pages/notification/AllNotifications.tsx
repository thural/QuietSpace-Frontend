import notificationQueries from "@/api/queries/notificationQueries";
import { Page } from "@/api/schemas/inferred/common";
import { Notification } from "@/api/schemas/inferred/notification";
import NotificationList from "@/components/notification/list/NotificationList";
import LoaderStyled from "@/components/shared/LoaderStyled";


const AllNotifications = () => {

    const { getNotificationsCache } = notificationQueries();

    const notificationsPage: Page<Notification> | undefined = getNotificationsCache();
    if (notificationsPage === undefined) return <LoaderStyled />;
    return <NotificationList notifications={notificationsPage.content} />
}

export default AllNotifications