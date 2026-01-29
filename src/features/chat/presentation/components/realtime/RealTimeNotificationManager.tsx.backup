/**
 * Real-time Notification Manager
 * 
 * This component provides advanced real-time notification management with priority handling,
 * notification queuing, and comprehensive notification types.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
    FiBell, 
    FiBellOff, 
    FiMessageSquare, 
    FiCheckCircle, 
    FiAlertTriangle, 
    FiInfo, 
    FiX,
    FiClock,
    FiUser,
    FiActivity
} from 'react-icons/fi';
import { useAdvancedWebSocket } from './AdvancedWebSocketManager';

export interface Notification {
    id: string;
    type: 'message' | 'mention' | 'reaction' | 'system' | 'presence' | 'error' | 'warning' | 'success' | 'info';
    title: string;
    message: string;
    body?: string;
    timestamp: Date;
    read: boolean;
    priority: 'low' | 'medium' | 'high' | 'critical';
    sender?: {
        id: string;
        name: string;
        avatar?: string;
    };
    recipient?: {
        id: string;
        name: string;
    };
    metadata?: {
        chatId?: string;
        messageId?: string;
        actionUrl?: string;
        actionText?: string;
        imageUrl?: string;
        category?: string;
        tags?: string[];
        expiresAt?: Date;
        persistent?: boolean;
    };
    actions?: Array<{
        id: string;
        label: string;
        action: () => void;
        primary?: boolean;
        icon?: React.ReactNode;
    }>;
}

export interface NotificationConfig {
    enableRealTimeNotifications: boolean;
    enableNotificationQueue: boolean;
    maxQueueSize: number;
    defaultTTL: number;
    enablePersistence: boolean;
    enableSound: boolean;
    enableDesktopNotifications: boolean;
    enableEmailNotifications: boolean;
    enablePushNotifications: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    enableGrouping: boolean;
    enableFiltering: boolean;
    enableSearch: boolean;
    enableArchiving: boolean;
    archiveAfterDays: number;
    maxArchiveSize: number;
    enablePriority: boolean;
    enableReadStatus: boolean;
    enableAutoMarkRead: boolean;
    autoMarkReadDelay: number;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    config: NotificationConfig;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    archiveNotification: (id: string) => void;
    unarchiveNotification: (id: string) => void;
    getNotification: (id: string) => Notification | undefined;
    getUnreadNotifications: () => Notification[];
    getNotificationsByType: (type: Notification['type']) => Notification[];
    getNotificationsByPriority: (priority: Notification['priority']) => Notification[];
    searchNotifications: (query: string) => Notification[];
    filterNotifications: (filters: NotificationFilters) => Notification[];
    updateConfig: (config: Partial<NotificationConfig>) => void;
    playNotificationSound: (type: Notification['type']) => void;
    vibrate: (pattern: number[]) => void;
    requestPermission: () => Promise<boolean>;
}

export interface NotificationFilters {
    types?: Notification['type'][];
    priorities?: Notification['priority'][];
    readStatus?: 'read' | 'unread' | 'archived';
    dateRange?: {
        start: Date;
        end: Date;
    };
    senders?: string[];
    recipients?: string[];
    tags?: string[];
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// Notification Provider
interface NotificationProviderProps {
    children: ReactNode;
    userId: string;
    config?: Partial<NotificationConfig>;
}

export const RealTimeNotificationManager: React.FC<NotificationProviderProps> = ({ 
    children, 
    userId,
    config: userConfig = {} 
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [config, setConfig] = useState<NotificationConfig>({
        enableRealTimeNotifications: true,
        enableNotificationQueue: true,
        maxQueueSize: 100,
        defaultTTL: 86400000, // 24 hours
        enablePersistence: true,
        enableSound: true,
        enableDesktopNotifications: true,
        enableEmailNotifications: false,
        enablePushNotifications: true,
        soundEnabled: true,
        vibrationEnabled: true,
        enableGrouping: true,
        enableFiltering: true,
        enableSearch: true,
        enableArchiving: true,
        archiveAfterDays: 30,
        maxArchiveSize: 1000,
        enablePriority: true,
        enableReadStatus: true,
        enableAutoMarkRead: true,
        autoMarkReadDelay: 5000,
        ...userConfig
    });

    const { send, on, off } = useAdvancedWebSocket();
    const notificationTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Generate unique notification ID
    const generateNotificationId = useCallback(() => {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Add notification
    const addNotification = useCallback((
        notification: Omit<Notification, 'id' | 'timestamp'>
    ): string => {
        const id = generateNotificationId();
        const timestamp = new Date();
        
        const newNotification: Notification = {
            id,
            ...notification,
            timestamp,
            read: false,
            metadata: {
                ...notification.metadata,
                expiresAt: new Date(timestamp.getTime() + config.defaultTTL)
            }
        };

        // Add to notifications list
        setNotifications(prev => {
            const newNotifications = [newNotification, ...prev];
            
            // Limit queue size
            if (newNotifications.length > config.maxQueueSize) {
                return newNotifications.slice(0, config.maxQueueSize);
            }
            
            return newNotifications;
        });

        // Update unread count
        setUnreadCount(prev => prev + 1);

        // Show desktop notification
        if (config.enableDesktopNotifications && Notification.permission === 'granted') {
            showDesktopNotification(newNotification);
        }

        // Play sound
        if (config.enableSound) {
            playNotificationSound(newNotification.type);
        }

        // Vibrate
        if (config.vibrationEnabled) {
            vibrateForNotification(newNotification.type);
        }

        // Broadcast notification
        if (config.enableRealTimeNotifications) {
            send({
                id: `notification-${id}`,
                type: 'notification',
                payload: {
                    notification: newNotification
                },
                timestamp: timestamp,
                sender: userId
            });
        }

        // Schedule auto-mark as read
        if (config.enableAutoMarkRead && config.autoMarkReadDelay > 0) {
            const timeout = setTimeout(() => {
                markAsRead(id);
            }, config.autoMarkReadDelay);
            
            notificationTimeoutsRef.current.set(id, timeout);
        }

        // Persist notification
        if (config.enablePersistence) {
            persistNotification(newNotification);
        }

        return id;
    }, [config, send, userId, config.maxQueueSize, config.enableDesktopNotifications, config.enableSound, config.vibrationEnabled, config.enableRealTimeNotifications, config.enableAutoMarkRead, config.autoMarkReadDelay, persistNotification]);

    // Remove notification
    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => {
            const newNotifications = prev.filter(n => n.id !== id);
            return newNotifications;
        });

        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Clear timeout
        if (notificationTimeoutsRef.current.has(id)) {
            clearTimeout(notificationTimeoutsRef.current.get(id));
            notificationTimeouts.current.delete(id);
        }

        // Remove from persistence
        if (config.enablePersistence) {
            removePersistedNotification(id);
        }
    }, [config, notificationTimeoutsRef, config.enablePersistence]);

    // Mark notification as read
    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => {
            const newNotifications = prev.map(n => 
                n.id === id ? { ...n, read: true } : n
            );
            return newNotifications;
        });

        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Clear timeout
        if (notificationTimeoutsRef.current.has(id)) {
            clearTimeout(notificationTimeouts.current.get(id));
            notificationTimeouts.current.delete(id);
        }

        // Update persistence
        if (config.enablePersistence) {
            updatePersistedNotification(id, { read: true });
        }
    }, [config, notificationTimeoutsRef, config.enablePersistence]);

    // Mark all notifications as read
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => {
            const newNotifications = prev.map(n => ({ ...n, read: true }));
            return newNotifications;
        });

        setUnreadCount(0);

        // Clear all timeouts
        notificationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        notificationTimeouts.current.clear();

        // Update persistence
        if (config.enablePersistence) {
            markAllPersistedNotificationsAsRead();
        }
    }, [config, config.enablePersistence]);

    // Clear all notifications
    const clearAll = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);

        // Clear all timeouts
        notificationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        notificationTimeouts.current.clear();

        // Clear persistence
        if (config.enablePersistence) {
            clearPersistedNotifications();
        }
    }, [config, config.enablePersistence]);

    // Archive notification
    const archiveNotification = useCallback((id: string) => {
        setNotifications(prev => {
            const newNotifications = prev.map(n => 
                n.id === id ? { ...n, metadata: { ...n.metadata, archived: true } } : n
            );
            return newNotifications;
        });

        // Update unread count
        setUnreadCount(prev => {
            const archivedNotification = prev.find(n => n.id === id);
            if (archivedNotification && !archivedNotification.read) {
                return Math.max(0, prev - 1);
            }
            return prev;
        });

        // Update persistence
        if (config.enablePersistence) {
            updatePersistedNotification(id, { archived: true });
        }
    }, [config, config.enablePersistence]);

    // Unarchive notification
    const unarchiveNotification = useCallback((id: string) => {
        setNotifications(prev => {
            const newNotifications = prev.map(n => 
                n.id === id ? { ...n, metadata: { ...n.metadata, archived: false } } : n
            );
            return newNotifications;
        });

        // Update unread count
        setUnreadCount(prev => {
            const unarchivedNotification = prev.find(n => n.id === id);
            if (unarchivedNotification && !unarchivedNotification.read) {
                return prev + 1;
            }
            return prev;
        });

        // Update persistence
        if (config.enablePersistence) {
            updatePersistedNotification(id, { archived: false });
        }
    }, [config, config.enablePersistence]);

    // Get notification by ID
    const getNotification = useCallback((id: string): Notification | undefined => {
        return notifications.find(n => n.id === id);
    }, [notifications]);

    // Get unread notifications
    const getUnreadNotifications = useCallback((): Notification[] => {
        return notifications.filter(n => !n.read && !n.metadata?.archived);
    }, [notifications]);

    // Get notifications by type
    const getNotificationsByType = useCallback((type: Notification['type']): Notification[] => {
        return notifications.filter(n => n.type === type);
    }, [notifications]);

    // Get notifications by priority
    const getNotificationsByPriority = useCallback((priority: Notification['priority']): Notification[] => {
        return notifications.filter(n => n.priority === priority);
    }, [notifications]);

    // Search notifications
    const searchNotifications = useCallback((query: string): Notification[] => {
        const lowercaseQuery = query.toLowerCase();
        return notifications.filter(n => 
            n.title.toLowerCase().includes(lowercaseQuery) ||
            n.message.toLowerCase().includes(lowercaseQuery) ||
            n.sender?.name?.toLowerCase().includes(lowercaseQuery) ||
            n.metadata?.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
    }, [notifications]);

    // Filter notifications
    const filterNotifications = useCallback((filters: NotificationFilters): Notification[] => {
        let filtered = [...notifications];

        if (filters.types) {
            filtered = filtered.filter(n => filters.types?.includes(n.type));
        }

        if (filters.priorities) {
            filtered = filtered.filter(n => filters.priorities?.includes(n.priority));
        }

        if (filters.readStatus) {
            filtered = filtered.filter(n => {
                if (filters.readStatus === 'read') return n.read;
                if (filters.readStatus === 'unread') return !n.read;
                if (filters.readStatus === 'archived') return n.metadata?.archived;
                return true;
            });
        }

        if (filters.dateRange) {
            filtered = filtered.filter(n => 
                n.timestamp >= filters.dateRange.start && 
                n.timestamp <= filters.dateRange.end
            );
        }

        if (filters.senders) {
            filtered = filtered.filter(n => 
                n.sender && filters.senders.includes(n.sender.id)
            );
        }

        if (filters.recipients) {
            filtered = filtered.filter(n => 
                n.recipient && filters.recipients.includes(n.recipient.id)
            );
        }

        if (filters.tags) {
            filtered = filtered.filter(n => 
                n.metadata?.tags?.some(tag => filters.tags?.includes(tag))
            );
        }

        return filtered;
    }, [notifications]);

    // Play notification sound
    const playNotificationSound = useCallback((type: Notification['type']) => {
        if (!config.soundEnabled) return;

        const audio = new Audio();
        
        // Different sounds for different notification types
        const soundMap = {
            message: '/sounds/notification-message.mp3',
            mention: '/sounds/notification-mention.mp3',
            reaction: '/sounds/notification-reaction.mp3',
            system: '/sounds/notification-system.mp3',
            error: '/sounds/notification-error.mp3',
            warning: '/sounds/notification-warning.mp3',
            success: '/sounds/notification-success.mp3',
            info: '/sounds/notification-info.mp3'
        };

        const soundFile = soundMap[type] || soundMap.info;
        
        audio.src = soundFile;
        audio.volume = 0.3;
        audio.play().catch(error => {
            console.warn('Failed to play notification sound:', error);
        });
    }, [config.soundEnabled]);

    // Vibrate for notification
    const vibrateForNotification = useCallback((type: Notification['type']) => {
        if (!config.vibrationEnabled) return;

        const vibrationPatterns = {
            message: [200, 100, 200],
            mention: [300, 200, 300],
            reaction: [100],
            system: [200, 100, 200],
            error: [500, 200, 500],
            warning: [300, 200, 300],
            success: [200, 100, 200],
            info: [100, 50, 100]
        };

        const pattern = vibrationPatterns[type] || vibrationPatterns.info;
        
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }, [config.vibrationEnabled]);

    // Show desktop notification
    const showDesktopNotification = useCallback((notification: Notification) => {
        if (!('Notification' in window)) return;

        const options = {
            body: notification.body,
            icon: '/notification-icon.png',
            badge: unreadCount > 0 ? unreadCount.toString() : undefined,
            tag: 'chat-notification',
            requireInteraction: notification.priority !== 'critical',
            silent: !config.soundEnabled
        };

        if ('Notification' in window) {
            new Notification(notification.title, {
                ...options,
                icon: notification.sender?.avatar || '/default-avatar.png'
            });
        }
    }, [unreadCount, config.soundEnabled]);

    // Request notification permission
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!('Notification' in window)) return true;

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }, []);

    // Handle incoming notifications
    useEffect(() => {
        const handleNotification = (data: any) => {
            const { notification } = data.payload;
            
            if (notification.recipient?.id === userId || !notification.recipient) {
                addNotification(notification);
            }
        };

        on('notification', handleNotification);

        return () => {
            off('notification', handleNotification);
        };
    }, [userId, addNotification, on, off]);

    // Initialize notifications from persistence
    useEffect(() => {
        if (config.enablePersistence) {
            loadPersistedNotifications();
        }
    }, [config.enablePersistence]);

    const value: NotificationContextType = {
        notifications,
        unreadCount,
        config,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        archiveNotification,
        unarchiveNotification,
        getNotification,
        getUnreadNotifications,
        getNotificationsByType,
        getNotificationsByPriority,
        searchNotifications,
        filterNotifications,
        updateConfig,
        playNotificationSound,
        vibrate,
        requestPermission
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

// Hook to use notifications
export const useRealTimeNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useRealTimeNotifications must be used within RealTimeNotificationManager');
    }
    return context;
};

// Notification Item Component
interface NotificationItemProps {
    notification: Notification;
    onRead?: (id: string) => void;
    onRemove?: (id: string) => void;
    onArchive?: (id: string) => void;
    onUnarchive?: (id: string) => void;
    className?: string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onRead,
    onRemove,
    onArchive,
    onUnarchive,
    className = ''
}) => {
    const { markAsRead, removeNotification, archiveNotification, unarchiveNotification } = useRealTimeNotifications();

    const getNotificationIcon = () => {
        switch (notification.type) {
            case 'message':
                return <FiMessageSquare className=\"text-blue-500\" />;
            case 'mention':
                return <FiUser className=\"text-purple-500\" />;
            case 'reaction':
                return <FiCheckCircle className=\"text-green-500\" />;
            case 'system':
                return <FiInfo className=\"text-gray-500\" />;
            case 'error':
                return <FiAlertTriangle className=\"text-red-500\" />;
            case 'warning':
                return <FiAlertTriangle className=\"text-yellow-500\" />;
            case 'success':
                return <FiCheckCircle className=\"text-green-500\" />;
            case 'info':
                return <FiInfo className=\"text-blue-500\" />;
            default:
                return <FiBell className=\"text-gray-500\" />;
        }
    };

    const getPriorityColor = () => {
        switch (notification.priority) {
            case 'critical':
                return 'border-red-500 bg-red-50';
            case 'high':
                return 'border-orange-500 bg-orange-50';
            case 'medium':
                return 'border-yellow-500 bg-yellow-50';
            case 'low':
                return 'border-green-500 bg-green-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };

    const isRead = notification.read || notification.metadata?.archived;

    return (
        <div
            className={`p-4 rounded-lg border ${getPriorityColor()} ${isRead ? 'opacity-60' : ''} ${className}`}
        >
            <div className=\"flex items-start justify-between mb-2\">
                <div className=\"flex items-center space-x-3\">
                    <div className=\"flex items-center space-x-2\">
                        {getNotificationIcon()}
                        <div className=\"flex-1 min-w-0\">
                            <div className=\"font-medium text-sm\">{notification.title}</div>
                            {notification.body && (
                                <div className=\"text-sm text-gray-600 mt-1\">{notification.body}</div>
                            )}
                        </div>
                    </div>
                    
                    {notification.sender && (
                        <div className=\"flex items-center space-x-2 text-sm text-gray-500\">
                            <div className=\"w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium\">
                                {notification.sender.avatar ? (
                                    <img
                                        src={notification.sender.avatar}
                                        alt={notification.sender.name}
                                        className=\"w-full h-full rounded-full\"
                                    />
                                ) : (
                                    <span className=\"text-gray-500\">
                                        {notification.sender.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <span className=\"text-xs text-gray-500\">
                                {new Date(notification.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    )}
                </div>
                
                <div className=\"flex items-center space-x-2\">
                    {!isRead && (
                        <button
                            onClick={() => onRead?.(notification.id)}
                            className=\"p-1 text-blue-600 hover:bg-blue-50 rounded\"
                            title=\"Mark as read\"
                        >
                            <FiCheckCircle />
                        </button>
                    )}
                    
                    <button
                        onClick={() => onRemove?.(notification.id)}
                        className=\"p-1 text-red-600 hover:bg-red-50 rounded\"
                        title=\"Remove notification\"
                    >
                        <FiX />
                    </button>
                    
                    {!notification.metadata?.archived && (
                        <button
                            onClick={() => onUnarchive?.(notification.id)}
                            className=\"p-1 text-green-600 hover:bg-green-50 rounded\"
                            title=\"Unarchive notification\"
                        >
                            <FiEye />
                        </button>
                    )}
                    
                    {isRead && !notification.metadata?.archived && (
                        <button
                            onClick={() => onArchive?.(notification.id)}
                            className=\"p-1 text-gray-600 hover:bg-gray-50 rounded\"
                            title=\"Archive notification\"
                        >
                            <FiEyeOff />
                        </button>
                    )}
                </div>
            </div>
            
            {notification.actions && notification.actions.length > 0 && (
                <div className=\"flex flex-wrap gap-2 mt-2\">
                    {notification.actions.map((action) => (
                        <button
                            key={action.id}
                            onClick={action.action}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                                action.primary
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {action.icon && <span className=\"mr-1\">{action.icon}</span>}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Notification Bell Component
interface NotificationBellProps {
    className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
    const { unreadCount, getUnreadNotifications } = useRealTimeNotifications();
    const { requestPermission } = useRealTimeNotifications();

    const handleClick = useCallback(async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
            // Show permission request UI
            showPermissionRequest();
        }
    }, [requestPermission]);

    const showPermissionRequest = useCallback(() => {
        // This would show a permission request UI
        console.log('Requesting notification permission...');
    }, []);

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={handleClick}
                className=\"relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full\"
                title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'No notifications'}
            >
                {unreadCount > 0 ? (
                    <>
                        <FiBell className=\"w-5 h-5\" />
                        <span className=\"absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center\">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    </>
                ) : (
                    <FiBellOff className=\"w-5 h-5\" />
                )}
            </button>
        </div>
    );
};

export default RealTimeNotificationManager;
