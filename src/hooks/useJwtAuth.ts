import { AuthPages, SetAuthState, SignupData, LoginData } from '@/components/shared/types/authTypes';
import { fetchAccessToken, fetchLogin, fetchLogout, fetchSignup } from '../api/authRequests';
import { JwtAuthProps } from '@/components/shared/types/hookPropTypes';
import { RefreshTokenResponse, AuthResponse } from '@/api/schemas/auth';

var refreshIntervalId: number | null = null;
const useJwtAuth = ({
    refreshInterval = 540000,
    onSuccessFn = () => { console.error("onSuccess handler is not supplied") },
    onErrorFn = (e: Error) => { console.error("error on stomp client: ", e) },
    onLoadFn = () => { console.error("onLoad handler is not supplied") }
}: JwtAuthProps) => {

    const register = (setAuthState: SetAuthState, formData: SignupData) => {

        const onSuccess = () => {
            setAuthState({ page: AuthPages.ACTIVATION, formData });
            onSuccessFn();
        }

        const onError = (error: Error) => {
            onErrorFn(error);
        }

        fetchSignup(formData)
            .then(onSuccess)
            .catch(onError);
    }


    const authenticate = (formData: LoginData) => {
        onLoadFn();

        const onSuccess = (data: AuthResponse) => {
            localStorage.setItem("refreshToken", data.refreshToken);
            onSuccessFn(data);
        }

        const onError = (error: Error) => {
            onErrorFn(error);
        }

        fetchLogin(formData)
            .then(response => response.json())
            .then(onSuccess)
            .catch(onError);
    }


    const getAccessToken = () => {
        const refreshToken = localStorage.getItem("refreshToken");

        const onSuccess = (data: RefreshTokenResponse) => {
            onSuccessFn(data);
        }

        const onError = (error: Error) => {
            onErrorFn(error);
        }

        fetchAccessToken(refreshToken)
            .then(response => response.json())
            .then(onSuccess)
            .catch(onError);
    }


    const loadAccessToken = () => {
        getAccessToken();
        refreshIntervalId = setInterval(getAccessToken, refreshInterval);
    }


    const stopTokenAutoRefresh = () => {
        clearInterval(refreshIntervalId);
    }


    const signout = () => {
        const refreshToken = localStorage.getItem("refreshToken");
        stopTokenAutoRefresh();
        onLoadFn();
        const onSignout = () => {
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            onSuccessFn();
        }

        const onError = (error: Error) => {
            onErrorFn(error);
        }

        fetchLogout(refreshToken)
            .then(onSignout)
            .catch(onError);
    }


    const signup = (formData: SignupData, setAuthState: SetAuthState) => {
        onLoadFn();

        const onSuccess = () => {
            onSuccessFn();
        }

        const onError = (error: Error) => {
            onErrorFn(error);
        }

        fetchSignup(formData)
            .then(onSuccess)
            .catch(onError);
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