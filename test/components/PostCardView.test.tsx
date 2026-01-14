import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PostCardView from '@/features/feed/post/PostCardView';

jest.mock('@/shared/BoxStyled', () => ({
    __esModule: true,
    default: (props: any) => React.createElement('div', { 'data-testid': 'box', ...props }, props.children)
}));

jest.mock('@/features/feed/fragments/PostHeader', () => ({
    __esModule: true,
    default: ({ children }: any) => <header data-testid="header">{children}</header>
}));

jest.mock('@/features/feed/fragments/PostContent', () => ({
    __esModule: true,
    default: ({ handleContentClick }: any) => <div data-testid="content" onClick={handleContentClick}>content</div>
}));

jest.mock('@/features/feed/fragments/PostInteractions', () => ({
    __esModule: true,
    default: () => <div data-testid="interactions">interactions</div>
}));

jest.mock('@/features/feed/fragments/PostMenu', () => ({
    __esModule: true,
    default: () => <div data-testid="menu">menu</div>
}));

jest.mock('@/features/feed/post/PostOverlays', () => ({
    __esModule: true,
    default: () => <div data-testid="overlays" />
}));

const samplePost = { id: 'p1' } as any;

test('renders PostCardView and handles navigation click', () => {
    const mockVm = {
        shareFormview: false,
        isMutable: false,
        isOverlayOpen: false,
        commentFormView: false,
        repostFormView: false,
        handleDeletePost: jest.fn(),
        toggleShareForm: jest.fn(),
        toggleRepostForm: jest.fn(),
        toggleEditForm: jest.fn(),
        toggleCommentForm: jest.fn(),
        handleNavigation: jest.fn(),
    } as any;

    const { getByTestId } = render(
        <PostCardView post={samplePost} postData={mockVm}>
            <div data-testid="child">child</div>
        </PostCardView>
    );

    fireEvent.click(getByTestId('box'));
    expect(mockVm.handleNavigation).toHaveBeenCalled();
    expect(getByTestId('header')).toBeTruthy();
    expect(getByTestId('content')).toBeTruthy();
    expect(getByTestId('overlays')).toBeTruthy();
});
