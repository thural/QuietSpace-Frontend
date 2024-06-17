import React, {useEffect, useState} from 'react';
import Keycloak from "keycloak-js";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
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