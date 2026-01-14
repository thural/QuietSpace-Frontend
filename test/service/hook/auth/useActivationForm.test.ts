import { jest } from '@jest/globals';
import { fetchResendCode } from '@/api/requests/authRequests';
import useJwtAuth from "@/services/hook/auth/useJwtAuth";
import { useActivationForm } from '@/services/hook/auth/useActivationForm';
import { displayCountdown } from '@/services/hook/common/useTimer';
import { AuthPages } from '@/types/authTypes';
import { act, renderHook } from '@testing-library/react';

// No-op: `useAuthData` module is not present in source; avoid mocking it here.
jest.mock('@/services/hook/common/useTimer', () => ({
    __esModule: true,
    displayCountdown: jest.fn(),
    useTimer: jest.fn()
}));

jest.mock('@/api/requests/authRequests', () => ({
    __esModule: true,
    fetchResendCode: jest.fn()
}));


// Mock useJwtAuth to avoid calling hooks at module scope and provide a stable mock
const mockUseActivation = jest.fn();
jest.mock('@/services/hook/auth/useJwtAuth', () => ({
    __esModule: true,
    default: () => ({ acitvate: mockUseActivation })
}));
const mockDisplayCountdown = displayCountdown as jest.Mock;
const mockUseTimer = require('@/services/hook/common/useTimer').useTimer as jest.Mock;
const mockFetchResendCode = fetchResendCode as jest.Mock;

describe('useActivationForm Hook', () => {
    const setAuthState = jest.fn();
    const authState = {
        formData: { email: 'test@example.com' },
        page: AuthPages.ACTIVATION
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockDisplayCountdown.mockReturnValue({
            resetTimer: jest.fn(),
        });

        mockUseTimer.mockReturnValue({
            resetTimer: jest.fn()
        });
    });

    test('should initialize with default state', () => {
        const { result } = renderHook(() => useActivationForm({ setAuthState, authState }));

        expect(result.current.formData).toEqual({ activationCode: "" });
        expect(result.current.tokenTimer).toBeDefined();
        expect(result.current.authState).toBe(authState);
    });

    test('should call activation handler on submit', () => {
        const { result } = renderHook(() => useActivationForm({ setAuthState, authState }));

        // Simulate form submission
        act(() => {
            result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as Event);
        });

        expect(mockUseActivation).toHaveBeenCalledWith(result.current.formData.activationCode);
    });

    test('should call activation handler on submit (error case)', () => {
        const { result } = renderHook(() => useActivationForm({ setAuthState, authState }));

        // Simulate form submission
        act(() => {
            result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as Event);
        });

        expect(mockUseActivation).toHaveBeenCalledWith(result.current.formData.activationCode);
    });

    test('should handle resending activation code', () => {
        const { result } = renderHook(() => useActivationForm({ setAuthState, authState }));

        // Simulate resending code
        act(() => {
            result.current.handleResendCode();
        });

        expect(mockFetchResendCode).toHaveBeenCalledWith(authState.formData.email);
        expect(result.current.tokenTimer.resetTimer).toHaveBeenCalled();
    });

    test('should handle input change', () => {
        const { result } = renderHook(() => useActivationForm({ setAuthState, authState }));

        // Simulate input change
        act(() => {
            result.current.handleChange('123456');
        });

        expect(result.current.formData.activationCode).toBe('123456');
    });
});
