import { AuthPages, SetAuthState, SignupBody, LoginBody } from '@/types/authTypes';
import { fetchAccessToken, fetchLogin, fetchLogout, fetchSignup } from '../api/authRequests';
import { JwtAuthProps } from '@/types/hookPropTypes';
import { RefreshTokenSchema, AuthSchema } from '@/api/schemas/auth';

var refreshIntervalId: number | null = null;

const useJwtAuth = ({
    refreshInterval = 540000,
    onSuccessFn = () => { console.error("onSuccess handler is not supplied") },
    onErrorFn = (e: Error) => { console.error("error on stomp client: ", e) },
    onLoadFn = () => { console.error("onLoad handler is not supplied") }
}: JwtAuthProps) => {

    const register = (setAuthState: SetAuthState, formData: SignupBody) => {

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


    const authenticate = (formData: LoginBody) => {
        onLoadFn();

        const onSuccess = (data: AuthSchema) => {
            localStorage.setItem("refreshToken", data.refreshToken);
            onSuccessFn(data);
        }

        const onError = (error: Error) => {
            onErrorFn(error);
        }

        fetchLogin(formData)
            .then(onSuccess)
            .catch(onError);
    }


    const getAccessToken = () => {
        const refreshToken = localStorage.getItem("refreshToken");

        const onSuccess = (data: RefreshTokenSchema) => {
            onSuccessFn(data);
        }

        const onError = (error: Error) => {
            onErrorFn(error);
        }

        fetchAccessToken(refreshToken)
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


    const signup = (formData: SignupBody, setAuthState: SetAuthState) => {
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