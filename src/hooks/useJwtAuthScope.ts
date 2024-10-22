import { fetchAccessToken, fetchLogin, fetchLogout, fetchSignup } from '../api/authRequests';

let refreshIntervalId = null;

export const stopTokenAutoRefresh = () => {
    clearInterval(refreshIntervalId);
}


export const register = ({ setAuthState, formData, onErrorFn }) => {

    const onSuccess = () => {
        setAuthState({ page: "activation", formData });
    }

    const onError = (error) => {
        onErrorFn(error);
    }

    fetchSignup(formData)
        .then(onSuccess)
        .catch(onError);
}


export const authenticate = ({ formData, onSuccessFn, onErrorFn, onLoadFn }) => {
    onLoadFn();

    const onSuccess = (data) => {
        localStorage.setItem("refreshToken", data.refreshToken);
        onSuccessFn(data);
    }

    const onError = (error) => {
        onErrorFn(error);
    }

    fetchLogin(formData)
        .then(onSuccess)
        .catch(onError);
}


export const getAccessToken = ({ onSuccessFn, onErrorFn }) => {
    const refreshToken = localStorage.getItem("refreshToken");

    const onSuccess = (data) => {
        onSuccessFn(data);
    }

    const onError = (error) => {
        stopTokenAutoRefresh();
        onErrorFn(error);
    }

    fetchAccessToken(refreshToken)
        .then(onSuccess)
        .catch(onError);
}


export const loadAccessToken = ({ refreshInterval = 540000, onSuccessFn }) => {
    getAccessToken({ onSuccessFn });
    refreshIntervalId = setInterval(() => {
        getAccessToken({ onSuccessFn });
    }, refreshInterval);
}


export const signout = ({ onSuccessFn, onErrorFn, onLoadFn }) => {
    const refreshToken = localStorage.getItem("refreshToken");
    stopTokenAutoRefresh();
    onLoadFn();
    const onSignout = (response) => {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        onSuccessFn(response);
    }

    const onError = (error) => {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        onErrorFn(error);
    }

    fetchLogout(refreshToken)
        .then(onSignout)
        .catch(onError);
}


export const signup = ({ formData, onSuccessFn, onErrorFn, onLoadFn }) => {
    onLoadFn();

    const onSuccess = () => {
        onSuccessFn();
    }

    const onError = (error) => {
        console.log("error on signup:", error.message);
        onErrorFn(error);
    }

    fetchSignup(formData)
        .then(onSuccess)
        .catch(onError);
}

