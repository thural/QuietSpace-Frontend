import { Outlet } from "react-router-dom";


const ProfilePage = () => {
    return (
        <>
            <Outlet context={{ textContext: "context passed down to nested routes" }} />
        </>
    )
}

export default ProfilePage