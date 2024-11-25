import { isPageIncludesEntity, pushToPageContent, setEntityContentSeen, transformInfinetePages } from "@/utils/dataUtils";
import { InfiniteData, UseInfiniteQueryResult, useQueryClient } from "@tanstack/react-query";
import { Page } from "../schemas/inferred/common";
import { Notification, NotificationPage } from "../schemas/inferred/notification";
import { ResId } from "../schemas/native/common";



const notificationQueries = () => {

    const queryClient = useQueryClient();

    const handleReceivedNotifcation = (notification: Notification) => {
        queryClient.setQueryData(['notifications'], (data: InfiniteData<NotificationPage>) => {
            const lastPageNumber = data.pages[0]?.number;
            const predicate = (page: Page<Notification>) => page.number === lastPageNumber;
            return pushToPageContent(data, notification, predicate);
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    const handleSeenNotification = (notification: Notification) => {
        queryClient.setQueryData(['notifications'], (data: InfiniteData<NotificationPage>) => {
            return transformInfinetePages(data, notification.id as ResId, isPageIncludesEntity, setEntityContentSeen);

        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
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