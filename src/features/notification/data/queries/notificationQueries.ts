import { isPageIncludesEntity, pushToPageContent, setEntityContentSeen, transformInfinetePages } from "@/shared/utils/dataUtils";
import { InfiniteData, UseInfiniteQueryResult, useQueryClient } from "@tanstack/react-query";
import { Page } from "@/shared/api/models/common";
import { NotificationEvent, NotificationPage, NotificationResponse } from "@/features/notification/data/models/notification";



const notificationQueries = () => {

    const queryClient = useQueryClient();


    const handleReceivedNotifcation = (notification: NotificationResponse) => {
        queryClient.setQueryData(['notifications'], (data: InfiniteData<NotificationPage>) => {
            const lastPageNumber = data.pages[0]?.number;
            const predicate = (page: Page<NotificationResponse>) => page.number === lastPageNumber;
            return pushToPageContent(data, notification, predicate);
        });
    };

    const handleSeenNotification = (event: NotificationEvent) => {
        queryClient.setQueryData(['notifications'], (data: InfiniteData<NotificationPage>) => {
            return transformInfinetePages(data, event.notificationId, isPageIncludesEntity, setEntityContentSeen);
        });
    };

    const getNotificationsCache = (): UseInfiniteQueryResult<Page<NotificationResponse>> | undefined => {
        return queryClient.getQueryData(["notifications"]);
    }


    return {
        handleReceivedNotifcation,
        handleSeenNotification,
        getNotificationsCache
    }
}

export default notificationQueries