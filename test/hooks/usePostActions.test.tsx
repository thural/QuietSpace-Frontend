import { jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/services/data/usePostData', () => ({
    __esModule: true,
    useDeletePost: (postId: string) => ({ mutate: jest.fn() })
}));

jest.mock('@/services/hook/feed/useReaction', () => ({
    __esModule: true,
    default: (postId: string) => jest.fn()
}));

import usePostActions from '@/services/hook/feed/usePostActions';

test('returns handlers for actions', () => {
    const qc = new QueryClient();
    const wrapper = ({ children }: any) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>;

    const { result } = renderHook(() => usePostActions('p1'), { wrapper });
    expect(typeof result.current.handleDeletePost).toBe('function');
    expect(typeof result.current.handleLike).toBe('function');
    expect(typeof result.current.handleDislike).toBe('function');
});
