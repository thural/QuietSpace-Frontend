import { isPageIncludesEntity, pushToPageContent, setEntityContentSeen, transformInfinetePages } from "@/utils/dataUtils";
import { InfiniteData, UseInfiniteQueryResult, useQueryClient } from "@tanstack/react-query";
import { Page } from "../schemas/inferred/common";
import { Notification, NotificationEvent, NotificationPage } from "../schemas/inferred/notification";



const notificationQueries = () => {

    const queryClient = useQueryClient();


    const handleReceivedNotifcation = (notification: Notification) => {
        queryClient.setQueryData(['notifications'], (data: InfiniteData<NotificationPage>) => {
            const lastPageNumber = data.pages[0]?.number;
            const predicate = (page: Page<Notification>) => page.number === lastPageNumber;
            return pushToPageContent(data, notification, predicate);
        });
    };

    const handleSeenNotification = (event: NotificationEvent) => {
        queryClient.setQueryData(['notifications'], (data: InfiniteData<NotificationPage>) => {
            return transformInfinetePages(data, event.notificationId, isPageIncludesEntity, setEntityContentSeen);
        });
    };

    const getNotificationsCache = (): UseInfiniteQueryResult<Page<Notification>> | undefined => {
        return queryClient.getQueryData(["notifications"]);
    }


    return {
        handleReceivedNotifcation,
        handleSeenNotification,
        getNotificationsCache
    }
}

export default notificationQueries