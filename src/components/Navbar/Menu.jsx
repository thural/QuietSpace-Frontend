import React, { useState } from "react";
import styles from "./styles/menuStyles";
import savedIcon from "../../assets/bookmark.svg";
import historyIcon from "../../assets/history.svg";
import settingsIcon from "../../assets/settings.svg";
import logoutIcon from "../../assets/log-out.svg";
import { fetchLogout } from "../../api/authRequests";
import { LOGOUT_URL } from "../../constants/ApiPath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RiMenu3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";


const Menu = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const auth = queryClient.getQueryData("auth");

    const classes = styles();
    const [display, setDisplay] = useState('none');

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const response = await fetchLogout(LOGOUT_URL, auth["token"]);
            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["posts", "user", "chat"]);
            queryClient.resetQueries("auth");
            console.log("user logout was success");
        },
        onError: (error, variables, context) => {
            console.log("error on logout:", error.message)
        }
    });

    const handleLogout = (event) => {
        event.preventDefault();
        logoutMutation();
    }

    return (
        <div style={{ display: user?.id ? "block" : "none" }}>
            <div className={classes.icon} onClick={toggleDisplay} style={{ cursor: 'pointer' }}>
                <RiMenu3Fill />
            </div>
            <div className={classes.menuOverlay} style={{ display }} onClick={toggleDisplay}></div>
            <div className={classes.menu} style={{ display }}>
                <div className="menu-item"><p>Saved</p><img src={savedIcon} /></div>
                <div className="menu-item"><p>Activity</p><img src={historyIcon} /></div>
                <div className="menu-item">
                    <Link to="/settings">
                        <div className="clickable">
                        <p>Settings</p>
                        <img src={settingsIcon} />
                        </div>
                    </Link>
                </div>
                <div className="menu-item" onClick={handleLogout}><p>Logout</p><img src={logoutIcon} /></div>
            </div>
        </div>
    )
}

export default Menu