import {useEffect, useRef, useState} from 'react';
import { useAuthStore } from './zustand';
import { fetchAccessToken, fetchLogout } from '../api/authRequests';
import { useQueryClient } from '@tanstack/react-query';

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

export const unloadTokens = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    const queryClient = useQueryClient();
    queryClient.invalidateQueries(["user"]);

    const refreshToken = localStorage.getItem("refreshToken");

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        setIsLoading(true);

        fetchLogout(refreshToken)
        .then((response) => {
            console.log("response on signing out: ", response);
            setIsSuccess(true);
        })
        .catch(error => {
            setError(error);
            setIsError(true);
            console.log("error on signing out: ", error);
        });

        localStorage.clear();
        setIsLoading(false);
    }, [])

    console.log("isSuccess: ", isSuccess)

    return {isSuccess, isLoading, isError, error}
}