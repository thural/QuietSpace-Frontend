import { jest } from '@jest/globals';
jest.mock('@/services/hook/shared/useNavigation', () => ({
    __esModule: true,
    default: () => ({ navigatePath: jest.fn() }),
}));
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import usePostNavigation from '@/services/hook/feed/usePostNavigation';

test('provides handleNavigation that calls navigatePath', () => {
    const wrapper = ({ children }: any) => <MemoryRouter>{children}</MemoryRouter>;
    const { result } = renderHook(() => usePostNavigation('post-1'), { wrapper });
    const fn = result.current.handleNavigation;
    expect(typeof fn).toBe('function');
});
