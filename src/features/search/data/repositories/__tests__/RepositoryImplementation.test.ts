/**
 * Repository Implementation Test.
 * 
 * Tests the actual repository implementations with real API calls.
 */

import { UserSearchRepository } from '../UserSearchRepository';
import { PostSearchRepository } from '../PostSearchRepository';
import { fetchUsersByQuery } from '../../../../../api/requests/userRequests';
import { fetchPostQuery } from '../../../../../api/requests/postRequests';

// Mock the auth store
jest.mock('../../../../../services/store/zustand', () => ({
    getState: jest.fn(() => ({
        data: {
            accessToken: 'mock-token-123',
            userId: 'user-123'
        }
    }))
}));

// Mock the API functions
jest.mock('../../../../../api/requests/userRequests', () => ({
    fetchUsersByQuery: jest.fn()
}));

jest.mock('../../../../../api/requests/postRequests', () => ({
    fetchPostQuery: jest.fn()
}));

const mockFetchUsersByQuery = fetchUsersByQuery as jest.MockedFunction<typeof fetchUsersByQuery>;
const mockFetchPostQuery = fetchPostQuery as jest.MockedFunction<typeof fetchPostQuery>;

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
            const mockResponse = {
                content: [
                    { id: '1', username: 'testuser', email: 'test@example.com' }
                ],
                pageable: { pageNumber: 0, pageSize: 10 }
            };

            // Mock the API function
            mockFetchUsersByQuery.mockResolvedValue(mockResponse);

            const result = await userRepo.searchUsers('test query');
            
            expect(fetchUsersByQuery).toHaveBeenCalledWith('test query', 'mock-token-123');
            expect(result).toEqual([
                { id: '1', username: 'testuser', email: 'test@example.com' }
            ]);
        });

        it('should handle API errors gracefully', async () => {
            mockFetchUsersByQuery.mockRejectedValue(new Error('API Error'));

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
            const mockResponse = {
                content: [
                    { id: '1', title: 'Test Post', text: 'Test content' }
                ],
                pageable: { pageNumber: 0, pageSize: 10 }
            };

            // Mock the API function
            mockFetchPostQuery.mockResolvedValue(mockResponse);

            const result = await postRepo.searchPosts('test query');
            
            expect(fetchPostQuery).toHaveBeenCalledWith('test query', 'mock-token-123');
            expect(result).toEqual([
                { id: '1', title: 'Test Post', text: 'Test content' }
            ]);
        });

        it('should handle API errors gracefully', async () => {
            mockFetchPostQuery.mockRejectedValue(new Error('API Error'));

            const result = await postRepo.searchPosts('test query');
            
            expect(result).toEqual([]);
        });
    });
});
