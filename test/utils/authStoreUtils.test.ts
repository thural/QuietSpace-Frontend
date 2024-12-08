import { getRefreshToken, clearRefreshToken, clearAccessToken, clearAuthTokens, setRefreshToken } from '@/utils/authStoreUtils';

describe('authStoreUtils', () => {
    beforeEach(() => {
        // Clear the localStorage before each test
        localStorage.clear();
    });

    describe('getRefreshToken', () => {
        it('should return the refresh token from localStorage', () => {
            const token = 'mock-refresh-token';
            localStorage.setItem('refreshToken', token);
            expect(getRefreshToken()).toBe(token);
        });

        it('should throw an error if the refresh token is not present', () => {
            expect(() => getRefreshToken()).toThrowError();
        });
    });

    describe('setRefreshToken', () => {
        it('should set the refresh token in localStorage', () => {
            const token = 'mock-refresh-token';
            setRefreshToken(token);
            expect(localStorage.getItem('refreshToken')).toBe(token);
        });
    });

    describe('clearRefreshToken', () => {
        it('should remove the refresh token from localStorage', () => {
            localStorage.setItem('refreshToken', 'mock-refresh-token');
            clearRefreshToken();
            expect(localStorage.getItem('refreshToken')).toBeNull();
        });
    });

    describe('clearAccessToken', () => {
        it('should remove the access token from localStorage', () => {
            localStorage.setItem('accessToken', 'mock-access-token');
            clearAccessToken();
            expect(localStorage.getItem('accessToken')).toBeNull();
        });
    });

    describe('clearAuthTokens', () => {
        it('should remove both refresh and access tokens from localStorage', () => {
            localStorage.setItem('refreshToken', 'mock-refresh-token');
            localStorage.setItem('accessToken', 'mock-access-token');
            clearAuthTokens();
            expect(localStorage.getItem('refreshToken')).toBeNull();
            expect(localStorage.getItem('accessToken')).toBeNull();
        });
    });
});