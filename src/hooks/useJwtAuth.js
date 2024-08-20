import { fetchAccessToken, fetchLogin, fetchLogout, fetchSignup } from '../api/authRequests';

var refreshIntervalId = null;
const useJwtAuth = ({ refreshInterval = 540000, onSuccessFn, onErrorFn = (e) => { console.log("error on stomp client: ", e) }, onLoadFn }) => {

    const register = (setAuthState, formData) => {

        const onSuccess = () => {
            setAuthState({ page: "activation", formData });
            onSuccessFn();
        }

        const onError = (error) => {
            onErrorFn(error);
        }

        fetchSignup(formData)
            .then(onSuccess)
            .catch(onError);
    }


    const authenticate = (formData) => {
        onLoadFn();

        const onSuccess = (data) => {
            localStorage.setItem("refreshToken", data.refreshToken);
            onSuccessFn(data);
        }

        const onError = (error) => {
            onErrorFn(error);
        }

        fetchLogin(formData)
            .then(response => response.json())
            .then(onSuccess)
            .catch(onError);
    }


    const getAccessToken = () => {
        const refreshToken = localStorage.getItem("refreshToken");

        const onSuccess = (data) => {
            onSuccessFn(data);
        }

        const onError = (error) => {
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
        const onSignout = (response) => {
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            onSuccessFn(response);
        }

        const onError = (error) => {
            onErrorFn();
        }

        fetchLogout(refreshToken)
            .then(onSignout)
            .catch(onError);
    }


    const signup = (formData, setAuthState) => {
        onLoadFn();

        const onSuccess = () => {
            onSuccessFn();
        }

        const onError = (error) => {
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