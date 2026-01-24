/**
 * Real-time Presence Manager
 * 
 * This component provides advanced presence management with typing indicators,
 * user status management, and real-time presence synchronization.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { FiUsers, FiCircle, FiEdit, FiEye, FiEyeOff, FiWifi, FiWifiOff } from 'react-icons/fi';
import { useAdvancedWebSocket } from './AdvancedWebSocketManager';

export interface UserPresence {
    userId: string;
    status: 'online' | 'away' | 'busy' | 'invisible' | 'offline';
    lastSeen: Date;
    isTyping: boolean;
    typingInChat?: string;
    typingSince?: Date;
    customStatus?: string;
    activity: {
        lastActivity: Date;
        currentChat?: string;
        pageView?: string;
        deviceType?: 'desktop' | 'mobile' | 'tablet';
    };
    metadata: {
        avatar?: string;
        displayName?: string;
        role?: string;
        department?: string;
        location?: string;
    };
}

export interface TypingIndicator {
    userId: string;
    chatId: string;
    isTyping: boolean;
    startedAt: Date;
    lastUpdate: Date;
    user?: UserPresence;
}

export interface PresenceConfig {
    enableTypingIndicators: boolean;
    enableStatusManagement: boolean;
    enableActivityTracking: boolean;
    typingTimeout: number;
    awayTimeout: number;
    offlineTimeout: number;
    enablePresenceBroadcast: boolean;
    enablePresencePersistence: boolean;
    maxTypingIndicators: number;
    presenceUpdateInterval: number;
}

interface PresenceContextType {
    users: Map<string, UserPresence>;
    typingIndicators: Map<string, TypingIndicator[]>;
    config: PresenceConfig;
    currentUser: UserPresence | null;
    updatePresence: (presence: Partial<UserPresence>) => void;
    updateStatus: (status: UserPresence['status']) => void;
    setTyping: (chatId: string, isTyping: boolean) => void;
    getTypingUsers: (chatId: string) => UserPresence[];
    isUserOnline: (userId: string) => boolean;
    isUserTyping: (userId: string, chatId: string) => boolean;
    getUserPresence: (userId: string) => UserPresence | undefined;
    getOnlineUsers: () => UserPresence[];
    updateConfig: (config: Partial<PresenceConfig>) => void;
    broadcastPresence: () => void;
}

const PresenceContext = createContext<PresenceContextType | null>(null);

// Presence Provider
interface PresenceProviderProps {
    children: ReactNode;
    userId: string;
    config?: Partial<PresenceConfig>;
}

export const RealTimePresenceProvider: React.FC<PresenceProviderProps> = ({ 
    children, 
    userId,
    config: userConfig = {} 
}) => {
    const [users, setUsers] = useState<Map<string, UserPresence>>(new Map());
    const [typingIndicators, setTypingIndicators] = useState<Map<string, TypingIndicator[]>>(new Map());
    const [currentUser, setCurrentUser] = useState<UserPresence | null>(null);

    const [config, setConfig] = useState<PresenceConfig>({
        enableTypingIndicators: true,
        enableStatusManagement: true,
        enableActivityTracking: true,
        typingTimeout: 3000,
        awayTimeout: 300000, // 5 minutes
        offlineTimeout: 600000, // 10 minutes
        enablePresenceBroadcast: true,
        enablePresencePersistence: true,
        maxTypingIndicators: 5,
        presenceUpdateInterval: 30000, // 30 seconds
        ...userConfig
    });

    const { send, on, off } = useAdvancedWebSocket();
    const typingTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
    const awayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const offlineTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize current user
    useEffect(() => {
        const initialPresence: UserPresence = {
            userId,
            status: 'online',
            lastSeen: new Date(),
            isTyping: false,
            activity: {
                lastActivity: new Date(),
                deviceType: 'desktop'
            },
            metadata: {}
        };

        setCurrentUser(initialPresence);
        setUsers(prev => new Map(prev).set(userId, initialPresence));
    }, [userId]);

    // Update user presence
    const updatePresence = useCallback((presence: Partial<UserPresence>) => {
        if (!currentUser) return;

        const updatedPresence: UserPresence = {
            ...currentUser,
            ...presence,
            lastSeen: new Date(),
            activity: {
                ...currentUser.activity,
                lastActivity: new Date(),
                ...presence.activity
            }
        };

        setCurrentUser(updatedPresence);
        setUsers(prev => new Map(prev).set(userId, updatedPresence));

        // Broadcast presence update
        if (config.enablePresenceBroadcast) {
            send({
                id: `presence-update-${Date.now()}`,
                type: 'presence_update',
                payload: {
                    userId,
                    presence: updatedPresence
                },
                timestamp: Date.now(),
                sender: userId
            });
        }
    }, [currentUser, config.enablePresenceBroadcast, send]);

    // Update user status
    const updateStatus = useCallback((status: UserPresence['status']) => {
        updatePresence({ status });
    }, [updatePresence]);

    // Set typing indicator
    const setTyping = useCallback((chatId: string, isTyping: boolean) => {
        if (!currentUser || !config.enableTypingIndicators) return;

        const now = Date.now();
        const typingIndicator: TypingIndicator = {
            userId: currentUser.userId,
            chatId,
            isTyping,
            startedAt: now,
            lastUpdate: now,
            user: currentUser
        };

        setTypingIndicators(prev => {
            const newIndicators = new Map(prev);
            const chatIndicators = newIndicators.get(chatId) || [];
            
            // Remove existing typing indicator for this user
            const filteredIndicators = chatIndicators.filter(ind => ind.userId !== currentUser.userId);
            
            if (isTyping) {
                filteredIndicators.push(typingIndicator);
            }
            
            newIndicators.set(chatId, filteredIndicators);
            return newIndicators;
        });

        // Update current user typing state
        updatePresence({ 
            isTyping, 
            typingInChat: isTyping ? chatId : undefined,
            typingSince: isTyping ? now : undefined 
        });

        // Broadcast typing indicator
        if (config.enablePresenceBroadcast) {
            send({
                id: `typing-${chatId}-${currentUser.userId}-${now}`,
                type: 'typing_indicator',
                payload: {
                    userId: currentUser.userId,
                    chatId,
                    isTyping,
                    timestamp: now
                },
                timestamp: now,
                sender: currentUser.userId
            });
        }

        // Clear existing timeout
        if (typingTimeoutsRef.current.has(`${currentUser.userId}-${chatId}`)) {
            clearTimeout(typingTimeoutsRef.current.get(`${currentUser.userId}-${chatId}`));
        }

        // Set new timeout to clear typing
        if (isTyping && config.typingTimeout > 0) {
            const timeout = setTimeout(() => {
                setTyping(chatId, false);
            }, config.typingTimeout);
            
            typingTimeoutsRef.current.set(`${currentUser.userId}-${chatId}`, timeout);
        }
    }, [currentUser, config.enableTypingIndicators, config.enablePresenceBroadcast, send, updatePresence, config.typingTimeout]);

    // Get typing users for a chat
    const getTypingUsers = useCallback((chatId: string): UserPresence[] => {
        const indicators = typingIndicators.get(chatId) || [];
        const typingUsers = indicators
            .filter(ind => ind.isTyping)
            .map(ind => ind.user)
            .filter(user => user !== null) as UserPresence[];
        
        return typingUsers;
    }, [typingIndicators]);

    // Check if user is online
    const isUserOnline = useCallback((userId: string): boolean => {
        const user = users.get(userId);
        if (!user) return false;
        
        const now = Date.now();
        const timeSinceLastSeen = now - user.lastSeen.getTime();
        
        return user.status === 'online' || 
               (user.status === 'away' && timeSinceLastSeen < config.awayTimeout);
    }, [users, config.awayTimeout]);

    // Check if user is typing in a specific chat
    const isUserTyping = useCallback((userId: string, chatId: string): boolean => {
        const indicators = typingIndicators.get(chatId) || [];
        return indicators.some(ind => ind.userId === userId && ind.isTyping);
    }, [typingIndicators]);

    // Get user presence
    const getUserPresence = useCallback((userId: string): UserPresence | undefined => {
        return users.get(userId);
    }, [users]);

    // Get all online users
    const getOnlineUsers = useCallback((): UserPresence[] => {
        return Array.from(users.values()).filter(user => isUserOnline(user.userId));
    }, [users, isUserOnline]);

    // Update configuration
    const updateConfig = useCallback((newConfig: Partial<PresenceConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    // Broadcast presence to all users
    const broadcastPresence = useCallback(() => {
        if (!currentUser || !config.enablePresenceBroadcast) return;

        send({
            id: `presence-broadcast-${Date.now()}`,
            type: 'presence_broadcast',
            payload: {
                userId: currentUser.userId,
                presence: currentUser
            },
            timestamp: Date.now(),
            sender: currentUser.userId
        });
    }, [currentUser, config.enablePresenceBroadcast, send]);

    // Handle incoming presence updates
    useEffect(() => {
        const handlePresenceUpdate = (data: any) => {
            const { userId: updateUserId, presence } = data.payload;
            
            if (updateUserId !== userId) {
                // Update other user's presence
                setUsers(prev => new Map(prev).set(updateUserId, {
                    ...prev.get(updateUserId),
                    ...presence,
                    lastSeen: new Date(presence.lastSeen)
                }));
            }
        };

        const handleTypingIndicator = (data: any) => {
            const { userId: typingUserId, chatId, isTyping } = data.payload;
            
            if (typingUserId !== userId) {
                setTypingIndicators(prev => {
                    const newIndicators = new Map(prev);
                    const chatIndicators = newIndicators.get(chatId) || [];
                    
                    // Remove existing typing indicator for this user
                    const filteredIndicators = chatIndicators.filter(ind => ind.userId !== typingUserId);
                    
                    if (isTyping) {
                        const user = users.get(typingUserId);
                        filteredIndicators.push({
                            userId: typingUserId,
                            chatId,
                            isTyping,
                            startedAt: new Date(),
                            lastUpdate: new Date(),
                            user
                        });
                    }
                    
                    newIndicators.set(chatId, filteredIndicators);
                    return newIndicators;
                });
            }
        };

        const handlePresenceBroadcast = (data: any) => {
            const { userId: broadcastUserId, presence } = data.payload;
            
            if (broadcastUserId !== userId) {
                setUsers(prev => new Map(prev).set(broadcastUserId, {
                    ...prev.get(broadcastUserId),
                    ...presence,
                    lastSeen: new Date(presence.lastSeen)
                }));
            }
        };

        on('presence_update', handlePresenceUpdate);
        on('typing_indicator', handleTypingIndicator);
        on('presence_broadcast', handlePresenceBroadcast);

        return () => {
            off('presence_update', handlePresenceUpdate);
            off('typing_indicator', handleTypingIndicator);
            off('presence_broadcast', handlePresenceBroadcast);
        };
    }, [userId, users, on, off]);

    // Auto-away functionality
    useEffect(() => {
        if (!config.enableStatusManagement || !currentUser) return;

        const awayTimeout = setTimeout(() => {
            if (currentUser.status === 'online') {
                updateStatus('away');
            }
        }, config.awayTimeout);

        awayTimeoutRef.current = awayTimeout;

        return () => {
            if (awayTimeoutRef.current) {
                clearTimeout(awayTimeoutRef.current);
            }
        };
    }, [config.enableStatusManagement, currentUser, config.awayTimeout, updateStatus]);

    // Auto-offline functionality
    useEffect(() => {
        if (!config.enableStatusManagement || !currentUser) return;

        const offlineTimeout = setTimeout(() => {
            if (currentUser.status === 'online' || currentUser.status === 'away') {
                updateStatus('offline');
            }
        }, config.offlineTimeout);

        offlineTimeoutRef.current = offlineTimeout;

        return () => {
            if (offlineTimeoutRef.current) {
                clearTimeout(offlineTimeoutRef.current);
            }
        };
    }, [config.enableStatusManagement, currentUser, config.offlineTimeout, updateStatus]);

    // Activity tracking
    useEffect(() => {
        if (!config.enableActivityTracking || !currentUser) return;

        const handleActivity = () => {
            updatePresence({
                activity: {
                    ...currentUser.activity,
                    lastActivity: new Date()
                }
            });
        };

        // Track page visibility
        const handleVisibilityChange = () => {
            updatePresence({
                activity: {
                    ...currentUser.activity,
                    lastActivity: new Date(),
                    pageView: document.visibilityState
                }
            });
        };

        // Track mouse movement
        const handleMouseMove = () => {
            handleActivity();
        };

        // Track keyboard activity
        const handleKeyDown = () => {
            handleActivity();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [config.enableActivityTracking, currentUser, updatePresence]);

    // Cleanup typing timeouts
    useEffect(() => {
        return () => {
            typingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
            awayTimeoutRef.current?.clearTimeout();
            offlineTimeoutRef.current?.clearTimeout();
        };
    }, []);

    const value: PresenceContextType = {
        users,
        typingIndicators,
        config,
        currentUser,
        updatePresence,
        updateStatus,
        setTyping,
        getTypingUsers,
        isUserOnline,
        isUserTyping,
        getUserPresence,
        getOnlineUsers,
        updateConfig,
        broadcastPresence
    };

    return (
        <PresenceContext.Provider value={value}>
            {children}
        </PresenceContext.Provider>
    );
};

// Hook to use presence
export const useRealTimePresence = () => {
    const context = useContext(PresenceContext);
    if (!context) {
        throw new Error('useRealTimePresence must be used within RealTimePresenceProvider');
    }
    return context;
};

// Presence Status Component
interface PresenceStatusProps {
    userId: string;
    showStatus?: boolean;
    showTyping?: boolean;
    className?: string;
}

export const PresenceStatus: React.FC<PresenceStatusProps> = ({ 
    userId, 
    showStatus = true, 
    showTyping = true,
    className = ''
}) => {
    const { getUserPresence, isUserOnline, isUserTyping } = useRealTimePresence();
    const presence = getUserPresence(userId);

    if (!presence) return null;

    const isOnline = isUserOnline(userId);
    const isTyping = showTyping && isUserTyping(userId, presence.typingInChat || '');

    const getStatusIcon = () => {
        if (!isOnline) return <FiWifiOff className=\"text-gray-400\" />;
        if (presence.status === 'busy') return <FiEdit className=\"text-red-500\" />;
        if (presence.status === 'away') return <FiCircle className=\"text-yellow-500\" />;
        return <FiWifi className=\"text-green-500\" />;
    };

    const getStatusColor = () => {
        if (!isOnline) return 'text-gray-400';
        if (presence.status === 'busy') return 'text-red-500';
        if (presence.status === 'away') return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            {showStatus && (
                <div className=\"flex items-center space-x-1\">
                    {getStatusIcon()}
                    <span className={`text-xs font-medium ${getStatusColor()}`}>
                        {presence.status}
                    </span>
                </div>
            )}
            
            {isTyping && (
                <div className=\"flex items-center space-x-1\">
                    <div className=\"flex space-x-1\">
                        <div className=\"w-2 h-2 bg-blue-500 rounded-full animate-pulse\" />
                        <div className=\"w-2 h-2 bg-blue-500 rounded-full animate-pulse\" />
                        <div className=\"w-2 h-2 bg-blue-500 rounded-full animate-pulse\" />
                    </div>
                    <span className=\"text-xs text-blue-500\">typing...</span>
                </div>
            )}
        </div>
    );
};

// Typing Indicator Component
interface TypingIndicatorProps {
    chatId: string;
    maxUsers?: number;
    className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
    chatId, 
    maxUsers = 3,
    className = ''
}) => {
    const { getTypingUsers } = useRealTimePresence();
    const typingUsers = getTypingUsers(chatId);

    if (typingUsers.length === 0) return null;

    const displayUsers = typingUsers.slice(0, maxUsers);

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className=\"flex -space-x-2\">
                {displayUsers.map((user, index) => (
                    <div
                        key={user.userId}
                        className=\"w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-medium ring-2 ring-white"
                        title={user.metadata?.displayName || user.userId}
                        style={{
                            backgroundImage: user.metadata?.avatar 
                                ? `url(${user.metadata.avatar})` 
                                : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {!user.metadata?.avatar && (
                            user.metadata?.displayName?.charAt(0).toUpperCase() || user.userId.charAt(0).toUpperCase()
                        )}
                    </div>
                ))}
            </div>
            
            {typingUsers.length > maxUsers && (
                <div className=\"text-xs text-gray-500\">
                    +{typingUsers.length - maxUsers} more
                </div>
            )}
            
            <div className=\"flex space-x-1\">
                <div className=\"w-2 h-2 bg-blue-500 rounded-full animate-pulse\" />
                <div className=\"w-2 h-2 bg-blue-500 rounded-full animate-pulse\" />
                <div className=\"w-2 h-2 bg-blue-500 rounded-full animate-pulse\" />
            </div>
            
            <span className=\"text-xs text-gray-500\">typing...</span>
        </div>
    );
};

export default RealTimePresenceProvider;
