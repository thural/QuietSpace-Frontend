import { fetchAccessToken, fetchLogin, fetchLogout, fetchSignup } from '../api/authRequests';
import { useQueryClient } from '@tanstack/react-query';

const useJwtAuth = ({ refreshInterval = 540000, onSuccessFn, onErrorFn, onLoadFn }) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const queryClient = useQueryClient();



    const register = (setAuthState, formData) => {
        const onSuccess = () => {
            console.log("signup was success");
            setAuthState({ page: "activation", formData });
        }

        const onError = (error) => {
            console.log("error on signup:", error.message);
        }

        fetchSignup(formData)
            .then(onSuccess)
            .catch(onError);
    }


    const authenticate = (formData) => {
        onLoadFn();

        const onSuccess = (data) => {
            console.log("login response from backend was success: ", data);
            localStorage.setItem("refreshToken", data.refreshToken);
            onSuccessFn(data);
        }

        const onError = (error) => {
            console.log("error on login:", error.message);
            onErrorFn(error);
        }

        fetchLogin(formData)
            .then(response => response.json())
            .then(onSuccess)
            .catch(onError);
    }


    const getAccessToken = () => {

        const onSuccess = (data) => {
            console.log("refresh token: ", refreshToken);
            console.log("fetched token: ", data.accessToken);
            onSuccessFn(data);

        }

        const onError = (error) => {
            console.log("error on fetching access token: ", error);
        }

        fetchAccessToken(refreshToken)
            .then(response => response.json())
            .then(onSuccess)
            .catch(onError);
    }


    const loadAccessToken = () => {
        getAccessToken();
        setInterval(() => {
            getAccessToken();
        }, refreshInterval);
    }


    const signout = () => {
        onLoadFn();
        const onSignout = (response) => {
            console.log("response on signing out: ", response);
            localStorage.clear();
            queryClient.clear();
            onSuccessFn(response);
        }

        const onError = (error) => {
            console.log("error on signing out: ", error);
            onErrorFn();
        }

        fetchLogout(refreshToken)
            .then(onSignout)
            .catch(onError);
    }


    const signup = (formData, setAuthState) => {
        onLoadFn();

        const onSuccess = () => {
            console.log("signup was success");
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



    return {
        loadAccessToken,
        signup,
        signout,
        authenticate,
        register,
    }
}

export default useJwtAuth