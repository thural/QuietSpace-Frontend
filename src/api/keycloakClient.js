import { UserManager } from "oidc-client";
import { getApiResponse } from "./commonRequest"

const settings = {
    authority: "http://backend-keycloak-auth:8080/auth/realms/quietspace-realm",
    client_id: "quietspcae-client",
    redirect_uri: "https://loaclhost:5000/signin-callback.html",
    response_type: "code",
    scope: "openid profile GLOBAL_READ_WRITE"
}

const userManager = new UserManager(settings);

export const getUser = () => {
    return userManager.getUser();
}

export const login = () => {
    return userManager.signinRedirect();
}

export const logout = () => {
    return userManager.signoutRedirect();
}

export const callApi = () => {
    getUser().then(user => {
        if (user && user.access_token) {
            return getApiResponse("http://localhost:8765/eureka/web","GET", null, user.access_token)
        } else throw new Error("user is not logged in");
    })
}