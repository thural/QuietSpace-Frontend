import { jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import usePostComments from '@/services/hook/feed/usePostComments';

jest.mock('@/services/data/useCommentData', () => ({
    __esModule: true,
    useGetComments: (postId: string) => ({
        data: { totalElements: 2, content: [{ userId: 'u1' }, { userId: 'u2' }] }
    })
}));

test('returns comments data and derived values', () => {
    const qc = new QueryClient();
    const wrapper = ({ children }: any) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>;

    const { result } = renderHook(() => usePostComments('p1', { id: 'u1' }), { wrapper });
    expect(result.current.commentCount).toBe(2);
    expect(result.current.hasCommented).toBe(true);
});
