import { clearAuthTokens, getRefreshToken, setRefreshToken } from '@/utils/authUtils';
import { fetchAccessToken, fetchLogin, fetchLogout, fetchSignup } from '../../api/requests/authRequests';
import { Auth } from '@/api/schemas/inferred/auth';

var refreshIntervalId: number | undefined = undefined;

export const stopTokenAutoRefresh = () => {
    window.clearInterval(refreshIntervalId);
}

export const register = ({ setAuthState, formData, onErrorFn }: any) => {
    const onSuccess = () => setAuthState({ page: "activation", formData });
    const onError = (error: Error) => onErrorFn(error);
    fetchSignup(formData).then(onSuccess).catch(onError);
}


export const authenticate = ({ formData, onSuccessFn, onErrorFn, onLoadFn }: any) => {
    onLoadFn();

    const onSuccess = (data: Auth) => {
        setRefreshToken(data.refreshToken)
        onSuccessFn(data);
    }

    const onError = (error: Error) => onErrorFn(error);
    fetchLogin(formData).then(onSuccess).catch(onError);
}


export const getAccessToken = ({ onSuccessFn, onErrorFn }: any) => {
    const refreshToken = getRefreshToken();
    const onSuccess = (data: any) => onSuccessFn(data);

    const onError = (error: Error) => {
        stopTokenAutoRefresh();
        onErrorFn(error);
    }

    fetchAccessToken(refreshToken).then(onSuccess).catch(onError);
}


export const loadAccessToken = ({ refreshInterval = 540000, onSuccessFn }: any) => {
    const callbackFn = () => getAccessToken({ onSuccessFn });
    refreshIntervalId = window.setInterval(callbackFn, refreshInterval);
}


export const signout = ({ onSuccessFn, onErrorFn, onLoadFn }: any) => {

    const refreshToken = getRefreshToken();
    stopTokenAutoRefresh();
    onLoadFn();

    const onSignout = (response: Response) => {
        clearAuthTokens();
        onSuccessFn(response);
    }

    const onError = (error: Error) => {
        console.log("(!) server side error on logging out, local credentials are cleared");
        clearAuthTokens();
        onErrorFn(error);
    }

    fetchLogout(refreshToken).then(onSignout).catch(onError);
}


export const signup = ({ formData, onSuccessFn, onErrorFn, onLoadFn }: any) => {
    onLoadFn();
    const onSuccess = () => onSuccessFn();
    const onError = (error: Error) => onErrorFn(error);
    fetchSignup(formData).then(onSuccess).catch(onError);
}
