import React, {useEffect, useRef, useState} from 'react';
import Keycloak from "keycloak-js";

const useAuth = () => {
    const hasRun = useRef(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const client = new Keycloak({
            url: import.meta.env.VITE_KEYCLOAK_URL,
            realm: import.meta.env.VITE_KEYCLOAK_REALM,
            clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
        })

        client.init({onLoad:"login-required"})
            .then(response => setIsAuthenticated(response));

    }, []);

    return isAuthenticated;
}

export default useAuth;