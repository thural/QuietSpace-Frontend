import { fetchResendCode } from '@/api/requests/authRequests';
import useJwtAuth from "@/services/hook/auth//useJwtAuth";
import { useActivationForm } from '@/services/hook/auth/useActivationForm';
import { displayCountdown } from '@/services/hook/common/useTimer';
import { AuthPages } from '@/types/authTypes';
import { act, renderHook } from '@testing-library/react';

jest.mock('@/services/data/useAuthData');
jest.mock('@/services/hook/common/useTimer');
jest.mock('@/api/requests/authRequests');


const { acitvate } = useJwtAuth({
    onSuccessFn: () => console.log("simulating success"),
    onErrorFn: () => console.log("simulating error")
});

const mockUseActivation = acitvate as jest.Mock;
const mockDisplayCountdown = displayCountdown as jest.Mock;
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
    });

    test('should initialize with default state', () => {
        const { result } = renderHook(() => useActivationForm({ setAuthState, authState }));

        expect(result.current.formData).toEqual({ activationCode: "" });
        expect(result.current.tokenTimer).toBeDefined();
        expect(result.current.authState).toBe(authState);
    });

    test('should handle activation success', () => {
        const mockMutate = jest.fn();
        mockUseActivation.mockReturnValue({ mutate: mockMutate });

        const { result } = renderHook(() => useActivationForm({ setAuthState, authState }));

        // Simulate form submission
        act(() => {
            result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as Event);
        });

        expect(mockMutate).toHaveBeenCalledWith(result.current.formData.activationCode);

        // Simulate success
        act(() => {
            const onSuccess = mockUseActivation.mock.calls[0][0];
            onSuccess();
        });

        expect(setAuthState).toHaveBeenCalledWith({ ...authState, page: AuthPages.LOGIN });
    });

    test('should handle activation error', () => {
        const mockMutate = jest.fn();
        mockUseActivation.mockReturnValue({ mutate: mockMutate });

        const { result } = renderHook(() => useActivationForm({ setAuthState, authState }));

        // Simulate form submission
        act(() => {
            result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as Event);
        });

        expect(mockMutate).toHaveBeenCalledWith(result.current.formData.activationCode);

        // Simulate error
        act(() => {
            const onError = mockUseActivation.mock.calls[0][1];
            onError(new Error('Activation failed'));
        });

        expect(console.log).toHaveBeenCalledWith("error on account activation:", 'Activation failed');
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
