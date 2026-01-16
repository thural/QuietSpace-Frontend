/**
 * Repository Implementation Test.
 * 
 * Tests the actual repository implementations with real API calls.
 */

import { UserSearchRepository } from '../UserSearchRepository';
import { PostSearchRepository } from '../PostSearchRepository';

// Mock the auth store
jest.mock('../../../../../services/store/zustand', () => ({
    getState: jest.fn(() => ({
        data: {
            accessToken: 'mock-token-123',
            userId: 'user-123'
        }
    }))
}));

describe('Repository Implementation Tests', () => {
    describe('UserSearchRepository', () => {
        let userRepo: UserSearchRepository;

        beforeEach(() => {
            userRepo = new UserSearchRepository();
        });

        it('should initialize with token from auth store', () => {
            expect(userRepo).toBeDefined();
        });

        it('should search users using real API', async () => {
            const mockFetch = jest.fn().mockResolvedValue({
                content: [
                    { id: '1', username: 'testuser', email: 'test@example.com' }
                ],
                pageable: { pageNumber: 0, pageSize: 10 }
            });

            // Mock the API function
            const { fetchUsersByQuery } = require('../../../../../api/requests/userRequests');
            fetchUsersByQuery.mockImplementation(mockFetch);

            const result = await userRepo.searchUsers('test query');
            
            expect(fetchUsersByQuery).toHaveBeenCalledWith('test query', 'mock-token-123');
            expect(result).toEqual([
                { id: '1', username: 'testuser', email: 'test@example.com' }
            ]);
        });

        it('should handle API errors gracefully', async () => {
            const mockFetch = jest.fn().mockRejectedValue(new Error('API Error'));
            const { fetchUsersByQuery } = require('../../../../../api/requests/userRequests');
            fetchUsersByQuery.mockImplementation(mockFetch);

            const result = await userRepo.searchUsers('test query');
            
            expect(result).toEqual([]);
        });
    });

    describe('PostSearchRepository', () => {
        let postRepo: PostSearchRepository;

        beforeEach(() => {
            postRepo = new PostSearchRepository();
        });

        it('should initialize with token from auth store', () => {
            expect(postRepo).toBeDefined();
        });

        it('should search posts using real API', async () => {
            const mockFetch = jest.fn().mockResolvedValue({
                content: [
                    { id: '1', title: 'Test Post', text: 'Test content' }
                ],
                pageable: { pageNumber: 0, pageSize: 10 }
            });

            // Mock the API function
            const { fetchPostQuery } = require('../../../../../api/requests/postRequests');
            fetchPostQuery.mockImplementation(mockFetch);

            const result = await postRepo.searchPosts('test query');
            
            expect(fetchPostQuery).toHaveBeenCalledWith('test query', 'mock-token-123');
            expect(result).toEqual([
                { id: '1', title: 'Test Post', text: 'Test content' }
            ]);
        });

        it('should handle API errors gracefully', async () => {
            const mockFetch = jest.fn().mockRejectedValue(new Error('API Error'));
            const { fetchPostQuery } = require('../../../../../api/requests/postRequests');
            fetchPostQuery.mockImplementation(mockFetch);

            const result = await postRepo.searchPosts('test query');
            
            expect(result).toEqual([]);
        });
    });
});
