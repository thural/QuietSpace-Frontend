import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import ReactionGroup from '@/features/feed/fragments/ReactionGroup';

const mockReaction = { reactionType: 'LIKE' } as any;

test('renders like and dislike toggles and calls handlers', () => {
    const handleLike = jest.fn();
    const handleDislike = jest.fn();

    const { container } = render(
        <ReactionGroup userReaction={mockReaction} handleLike={handleLike} handleDislike={handleDislike} />
    );

    const icons = container.getElementsByClassName('posticon');
    expect(icons.length).toBeGreaterThanOrEqual(1);

    // click the first icon (like)
    fireEvent.click(icons[0]);
    expect(handleLike).toHaveBeenCalled();
});
