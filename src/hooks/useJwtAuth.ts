import { AuthPages, SetAuthState, SignupBody, LoginBody } from '@/types/authTypes';
import { fetchAccessToken, fetchLogin, fetchLogout, fetchSignup } from '../api/requests/authRequests';
import { JwtAuthProps } from '@/types/hookPropTypes';
import { RefreshToken, Auth } from '@/api/schemas/inferred/auth';
import { clearAuthTokens, getRefreshToken, setRefreshToken } from '@/utils/authUtils';

var refreshIntervalId: number;

const useJwtAuth = ({
    refreshInterval = 540000,
    onSuccessFn = () => { console.error("onSuccess handler is not supplied") },
    onErrorFn = (e: Error) => { console.error("error on stomp client: ", e) },
    onLoadFn = () => { console.error("onLoad handler is not supplied") }
}: JwtAuthProps) => {

    const register = (setAuthState: SetAuthState, formData: SignupBody) => {

        const onSuccess = (response: Response) => {
            setAuthState({ page: AuthPages.ACTIVATION, formData });
            onSuccessFn(response);
        }

        const onError = (error: Error) => onErrorFn(error);
        fetchSignup(formData).then(onSuccess).catch(onError);
    }


    const authenticate = (formData: LoginBody) => {
        onLoadFn();

        const onSuccess = (data: Auth) => {
            setRefreshToken(data.refreshToken)
            onSuccessFn(data);
        }

        const onError = (error: Error) => onErrorFn(error);
        fetchLogin(formData).then(onSuccess).catch(onError);
    }


    const getAccessToken = () => {
        const refreshToken = getRefreshToken();
        const onSuccess = (data: RefreshToken) => onSuccessFn(data);
        const onError = (error: Error) => onErrorFn(error);
        fetchAccessToken(refreshToken).then(onSuccess).catch(onError);
    }


    const loadAccessToken = () => {
        getAccessToken();
        refreshIntervalId = window.setInterval(getAccessToken, refreshInterval);
    }


    const stopTokenAutoRefresh = () => clearInterval(refreshIntervalId);


    const signout = () => {
        const refreshToken = getRefreshToken();
        stopTokenAutoRefresh();

        onLoadFn();
        const onSignout = () => {
            clearAuthTokens();
            onSuccessFn();
        }

        const onError = (error: Error) => onErrorFn(error);
        fetchLogout(refreshToken).then(onSignout).catch(onError);
    }


    const signup = (formData: SignupBody) => {
        onLoadFn();
        const onSuccess = () => onSuccessFn();
        const onError = (error: Error) => onErrorFn(error);
        fetchSignup(formData).then(onSuccess).catch(onError);
    }



    return {
        loadAccessToken,
        signup,
        signout,
        authenticate,
        register,
    }
}

export default useJwtAuth