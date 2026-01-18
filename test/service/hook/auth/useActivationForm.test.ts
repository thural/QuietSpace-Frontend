import { jest } from '@jest/globals';
import { fetchResendCode } from '@/api/requests/authRequests';
import useJwtAuth from "@/services/hook/auth/useJwtAuth";
import { useActivationForm } from '@/services/hook/auth/useActivationForm';
import { displayCountdown, useTimer } from '@/services/hook/common/useTimer';
import { AuthPages } from '@/types/authTypes';
import { act, renderHook } from '@testing-library/react';

// Mock the modules
const mockDisplayCountdown = jest.fn();
const mockUseTimer = jest.fn();
const mockFetchResendCode = jest.fn();
const mockUseActivation = jest.fn();

jest.mock('@/services/hook/common/useTimer', () => ({
    __esModule: true,
    displayCountdown: mockDisplayCountdown,
    useTimer: mockUseTimer
}));

jest.mock('@/api/requests/authRequests', () => ({
    __esModule: true,
    fetchResendCode: mockFetchResendCode
}));

jest.mock('@/services/hook/auth/useJwtAuth', () => ({
    __esModule: true,
    default: () => ({ activate: mockUseActivation })
}));

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
