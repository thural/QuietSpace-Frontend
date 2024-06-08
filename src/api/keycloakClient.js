import { UserManager } from "oidc-client";
import { getApiResponse } from "./commonRequest"

const settings = {
    authority: "http://localhost:9191/realms/quietspace",
    client_id: "quietspace-frontend-client",
    redirect_uri: "http://localhost:5000/signin-callback.html",
    response_type: "code",
    scope: "openid profile dummy.read"
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
            return getApiResponse("http://localhost:8765/api/v1/dummy/hello/user-email","GET", null, user.access_token)
        } else throw new Error("user is not logged in");
    })
}