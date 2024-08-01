import {useEffect, useState} from 'react';
import { useAuthStore } from './zustand';
import { fetchAccessToken } from '../api/authRequests';

export const loadAccessToken = async () => {

    const { data: authData, setAuthData } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState("");

    const refreshToken = localStorage.getItem("refreshToken");
      

    useEffect(() => {
        setInterval(() => {
            setIsLoading(true);
            fetchAccessToken(refreshToken)
            .then((response) => {
                console.log("response: ", response);
                return response.json();
            })
            .then(data => setAccessToken(data.accessToken))
            .catch(error => {
                setError(error);
                setIsError(true);
                console.log("error on fetching access token: ", error);
            });
            setIsLoading(false);
        }, 540000);
    }, [])

    useEffect(() => {
        console.log("setting auth data...");
        setAuthData({ message: "", accessToken, refreshToken, userId: "" })
    }, [accessToken]);

    return {isSuccess: !!accessToken, isLoading, isError, error}

}

export const getAccessToken = async (refreshToken) => {
    return await fetchAccessToken(refreshToken);
}