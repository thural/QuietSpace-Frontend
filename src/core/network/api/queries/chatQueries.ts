/**
 * Chat Queries - Mock Implementation
 *
 * This is a temporary mock implementation to fix test imports.
 * In a real implementation, these would be actual React Query hooks.
 */

// Mock React Query hooks for testing
const mockUseQuery = (options: unknown) => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn()
});

const mockUseMutation = (options: unknown) => ({
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

// Mock types
interface MockChatMessage {
    id: string;
    content: string;
    senderId: string;
    timestamp: Date;
    type: 'text' | 'image' | 'file';
}

interface MockChatRoom {
    id: string;
    name: string;
    participants: string[];
    lastMessage?: MockChatMessage;
}

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
            ] as MockChatRoom[];
        }
    });
};

export const useChatMessages = (roomId: string) => {
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
            ] as MockChatMessage[];
        },
        enabled: !!roomId
    });
};

export const useSendMessage = () => {
    const queryClient = mockUseQueryClient();

    return mockUseMutation({
        mutationFn: async ({ roomId, content }: { roomId: string; content: string }) => {
            // Mock implementation
            const newMessage: MockChatMessage = {
                id: `msg-${Date.now()}`,
                content,
                senderId: 'current-user',
                timestamp: new Date(),
                type: 'text'
            };

            return newMessage;
        },
        onSuccess: (data: unknown, variables: unknown) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['chatMessages', variables.roomId] });
        }
    });
};

export const useCreateChatRoom = () => {
    const queryClient = mockUseQueryClient();

    return mockUseMutation({
        mutationFn: async ({ name, participants }: { name: string; participants: string[] }) => {
            // Mock implementation
            const newRoom: MockChatRoom = {
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
