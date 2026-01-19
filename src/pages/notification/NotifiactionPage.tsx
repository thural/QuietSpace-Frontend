import NotificationContainer from "@/features/notification/presentation/NotificationContainer";
import { Outlet } from "react-router-dom";


const NotificationPage = () => {
    return <NotificationContainer>
        <Outlet />
    </NotificationContainer>
}

export default NotificationPage