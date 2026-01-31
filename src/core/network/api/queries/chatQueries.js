/**
 * Chat Queries - Mock Implementation
 * 
 * This is a temporary mock implementation to fix test imports.
 * In a real implementation, these would be actual React Query hooks.
 */

// Mock React Query hooks for testing
const mockUseQuery = (options) => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn()
});

const mockUseMutation = (options) => ({
    mutate: jest.fn(),
    isLoading: false,
    error: null,
    data: null
});

const mockUseQueryClient = () => ({
    invalidateQueries: jest.fn(),
    getQueryData: jest.fn(),
    setQueryData: jest.fn()
});

/**
 * Mock chat message interface
 * @typedef {Object} MockChatMessage
 * @property {string} id - Message ID
 * @property {string} content - Message content
 * @property {string} senderId - Sender ID
 * @property {Date} timestamp - Message timestamp
 * @property {'text'|'image'|'file'} type - Message type
 */

/**
 * Mock chat room interface
 * @typedef {Object} MockChatRoom
 * @property {string} id - Room ID
 * @property {string} name - Room name
 * @property {Array<string>} participants - Participant IDs
 * @property {MockChatMessage} [lastMessage] - Last message in room
 */

// Mock hooks for chat queries
export const useChatRooms = () => {
    return mockUseQuery({
        queryKey: ['chatRooms'],
        queryFn: async () => {
            // Mock implementation
            return [
                {
                    id: 'room1',
                    name: 'General Chat',
                    participants: ['user1', 'user2'],
                    lastMessage: {
                        id: 'msg1',
                        content: 'Hello!',
                        senderId: 'user1',
                        timestamp: new Date(),
                        type: 'text'
                    }
                }
            ];
        }
    });
};

/**
 * Hook for getting chat messages
 * @param {string} roomId - Room ID
 * @returns {Object} Query result
 */
export const useChatMessages = (roomId) => {
    return mockUseQuery({
        queryKey: ['chatMessages', roomId],
        queryFn: async () => {
            // Mock implementation
            return [
                {
                    id: 'msg1',
                    content: 'Hello!',
                    senderId: 'user1',
                    timestamp: new Date(),
                    type: 'text'
                }
            ];
        },
        enabled: !!roomId
    });
};

/**
 * Hook for sending messages
 * @returns {Object} Mutation result
 */
export const useSendMessage = () => {
    const queryClient = mockUseQueryClient();

    return mockUseMutation({
        mutationFn: async ({ roomId, content }) => {
            // Mock implementation
            const newMessage = {
                id: `msg-${Date.now()}`,
                content,
                senderId: 'current-user',
                timestamp: new Date(),
                type: 'text'
            };

            return newMessage;
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['chatMessages', variables.roomId] });
        }
    });
};

/**
 * Hook for creating chat rooms
 * @returns {Object} Mutation result
 */
export const useCreateChatRoom = () => {
    const queryClient = mockUseQueryClient();

    return mockUseMutation({
        mutationFn: async ({ name, participants }) => {
            // Mock implementation
            const newRoom = {
                id: `room-${Date.now()}`,
                name,
                participants
            };

            return newRoom;
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
        }
    });
};

// Mock chat queries object for compatibility
export const chatQueries = {
    useChatRooms,
    useChatMessages,
    useSendMessage,
    useCreateChatRoom
};
