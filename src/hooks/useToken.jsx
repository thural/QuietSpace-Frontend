import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from './zustand';
import { fetchAccessToken, fetchLogout } from '../api/authRequests';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const loadAccessToken = async () => {
    const { setAuthData, setIsAuthenticated } = useAuthStore();
    const refreshToken = localStorage.getItem("refreshToken");
    const [accessToken, setAccessToken] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const loadData = () => {
        setIsLoading(true);
        fetchAccessToken(refreshToken)
            .then((response) => {
                return response.json();
            })
            .then(data => {
                setAccessToken(data.accessToken);
            })
            .catch(error => {
                console.log("error on fetching access token: ", error);
                setError(error);
                setIsError(true);
                setIsAuthenticated(false);
            });
        setIsLoading(false);
    }

    useEffect(() => {
        loadData();
        const timer = setInterval(() => {
            loadData();
        }, 540000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setAuthData({ message: "", accessToken, refreshToken, userId: "" })
    }, [accessToken]);

    return { isSuccess: !!accessToken, isLoading, isError, error }
}

export const getAccessToken = async (refreshToken) => {
    return await fetchAccessToken(refreshToken);
}

export const unloadTokens = () => {
    const { resetAuthData, setIsAuthenticated } = useAuthStore();
    const refreshToken = localStorage.getItem("refreshToken");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const hasRun = useRef(false);

    const doLogout = () => {
        localStorage.clear();
        resetAuthData();
        queryClient.clear();
        setIsAuthenticated(false);
        navigate("/signin");
    }

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

        setIsLoading(false);
        doLogout();
    }, []);

    return { isSuccess, isLoading, isError, error }
}