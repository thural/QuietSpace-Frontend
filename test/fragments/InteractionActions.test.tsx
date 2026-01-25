import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import InteractionActions from '@/features/feed/fragments/InteractionActions';

jest.mock('@/features/feed/fragments/CommentToggle', () => ({
    __esModule: true,
    default: ({ toggleForm }: any) => <button data-testid="comment" onClick={toggleForm}>comment</button>
}));

jest.mock('@/features/feed/fragments/ShareMenu', () => ({
    __esModule: true,
    default: ({ handleShareClick, handleRepostClick }: any) => (
        <div>
            <button data-testid="share" onClick={handleShareClick}>share</button>
            <button data-testid="repost" onClick={handleRepostClick}>repost</button>
        </div>
    )
}));

// Mock ListMenu which relies on theme values and jss; provide a simple stub
jest.mock('@/shared/ListMenu', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="listmenu">menu</div>
}));

test('renders actions and triggers callbacks', () => {
    const toggleCommentForm = jest.fn();
    const toggleShareForm = jest.fn();
    const toggleRepostForm = jest.fn();

    const { getByTestId } = render(
        <InteractionActions
            hasCommented={false}
            toggleCommentForm={toggleCommentForm}
            toggleShareForm={toggleShareForm}
            toggleRepostForm={toggleRepostForm}
        />
    );

    fireEvent.click(getByTestId('comment'));
    expect(toggleCommentForm).toHaveBeenCalled();

    fireEvent.click(getByTestId('share'));
    expect(toggleShareForm).toHaveBeenCalled();

    fireEvent.click(getByTestId('repost'));
    expect(toggleRepostForm).toHaveBeenCalled();
});
