import { renderHook, act } from '@testing-library/react';
import usePostForms from '@/services/hook/feed/usePostForms';

test('toggles form visibility correctly', () => {
    const { result } = renderHook(() => usePostForms());

    act(() => {
        result.current.toggleCommentForm({ stopPropagation: () => { } } as any);
    });
    expect(result.current.commentFormView).toBe(true);

    act(() => {
        result.current.toggleEditForm({ stopPropagation: () => { } } as any);
    });
    expect(result.current.isOverlayOpen).toBe(true);

    act(() => {
        result.current.toggleRepostForm({ stopPropagation: () => { } } as any);
    });
    expect(result.current.repostFormView).toBe(true);

    act(() => {
        result.current.toggleShareForm({ stopPropagation: () => { } } as any);
    });
    expect(result.current.shareFormview).toBe(true);
});
