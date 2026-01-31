/**
 * Enterprise Real-Time Notification Manager
 * 
 * This component provides advanced real-time notification management with priority handling,
 * notification queuing, and comprehensive notification types. Moved from chat feature
 * to maintain proper separation of concerns.
 * 
 * Features:
 * - Enterprise-grade notification management
 * - Real-time WebSocket integration
 * - Priority-based notification handling
 * - Comprehensive notification types
 * - Accessibility support
 * - Theme integration
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Container, Button, Text, Avatar } from '@/shared/ui/components';
import { useTheme } from '@/core/theme';
import { useEnterpriseWebSocket } from '@/core/websocket/hooks/useEnterpriseWebSocket';

/**
 * Notification type enum
 */
export type NotificationType = 'message' | 'mention' | 'reaction' | 'system' | 'presence' | 'error' | 'warning' | 'success' | 'info';

/**
 * Notification priority enum
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Notification interface
 */
export interface INotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    body?: string;
    timestamp: Date;
    read: boolean;
    priority: NotificationPriority;
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

/**
 * Notification configuration interface
 */
export interface INotificationConfig {
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

/**
 * Notification filters interface
 */
export interface INotificationFilters {
    types?: NotificationType[];
    priorities?: NotificationPriority[];
    readStatus?: 'read' | 'unread' | 'archived';
    dateRange?: {
        start: Date;
        end: Date;
    };
    searchQuery?: string;
    tags?: string[];
}

/**
 * Notification context type
 */
interface INotificationContextType {
    notifications: INotification[];
    unreadCount: number;
    config: INotificationConfig;
    addNotification: (notification: Omit<INotification, 'id' | 'timestamp'>) => string;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    archiveNotification: (id: string) => void;
    unarchiveNotification: (id: string) => void;
    getNotification: (id: string) => INotification | undefined;
    getUnreadNotifications: () => INotification[];
    getNotificationsByType: (type: NotificationType) => INotification[];
    getNotificationsByPriority: (priority: NotificationPriority) => INotification[];
    searchNotifications: (query: string) => INotification[];
    filterNotifications: (filters: INotificationFilters) => INotification[];
    updateConfig: (config: Partial<INotificationConfig>) => void;
    playNotificationSound: (type: NotificationType) => void;
    vibrate: (pattern: number[]) => void;
    requestPermission: () => Promise<boolean>;
}

/**
 * Notification provider props
 */
interface INotificationProviderProps {
    children: React.ReactNode;
    userId: string;
    config?: Partial<INotificationConfig>;
}

/**
 * Notification context
 */
const NotificationContext = createContext<INotificationContextType | null>(null);

/**
 * Enterprise Real-Time Notification Manager Component
 * 
 * Provides comprehensive notification management with real-time updates,
 * priority handling, and enterprise-grade features.
 */
export const RealTimeNotificationManager: React.FC<INotificationProviderProps> = ({
    children,
    userId,
    config: userConfig = {}
}) => {
    const theme = useTheme();
    const { sendMessage, subscribe } = useEnterpriseWebSocket({
        autoConnect: true,
        enableMetrics: true
    });

    // State management
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [config, setConfig] = useState<INotificationConfig>({
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
        enableAutoMarkRead: false,
        autoMarkReadDelay: 5000,
        ...userConfig
    });

    // Refs for timers and timeouts
    const notificationTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
    const audioContextRef = useRef<AudioContext | null>(null);

    // Generate unique notification ID
    const generateNotificationId = useCallback((): string => {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Add notification
    const addNotification = useCallback((
        notification: Omit<INotification, 'id' | 'timestamp'>
    ): string => {
        const id = generateNotificationId();
        const timestamp = new Date();

        const newNotification: INotification = {
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
            const updated = [newNotification, ...prev];

            // Apply queue size limit
            if (config.enableNotificationQueue && updated.length > config.maxQueueSize) {
                return updated.slice(0, config.maxQueueSize);
            }

            return updated;
        });

        // Set up auto-expiry
        if (newNotification.metadata?.expiresAt) {
            const timeout = setTimeout(() => {
                removeNotification(id);
            }, newNotification.metadata.expiresAt.getTime() - Date.now());

            notificationTimeoutsRef.current.set(id, timeout);
        }

        // Play sound if enabled
        if (config.enableSound && config.soundEnabled) {
            playNotificationSound(notification.type);
        }

        // Vibrate if enabled
        if (config.vibrationEnabled) {
            vibrate([200, 100, 200]);
        }

        // Send desktop notification if enabled
        if (config.enableDesktopNotifications) {
            sendDesktopNotification(newNotification);
        }

        return id;
    }, [config]);

    // Remove notification
    const removeNotification = useCallback((id: string): void => {
        setNotifications(prev => prev.filter(n => n.id !== id));

        // Clear timeout
        const timeout = notificationTimeoutsRef.current.get(id);
        if (timeout) {
            clearTimeout(timeout);
            notificationTimeoutsRef.current.delete(id);
        }
    }, []);

    // Mark as read
    const markAsRead = useCallback((id: string): void => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback((): void => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    // Clear all notifications
    const clearAll = useCallback((): void => {
        setNotifications([]);

        // Clear all timeouts
        notificationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        notificationTimeoutsRef.current.clear();
    }, []);

    // Archive notification
    const archiveNotification = useCallback((id: string): void => {
        // In a real implementation, this would move to archive storage
        removeNotification(id);
    }, [removeNotification]);

    // Unarchive notification
    const unarchiveNotification = useCallback((id: string): void => {
        // In a real implementation, this would restore from archive
        // For now, just log
        console.log('Unarchive notification:', id);
    }, []);

    // Get notification by ID
    const getNotification = useCallback((id: string): INotification | undefined => {
        return notifications.find(n => n.id === id);
    }, [notifications]);

    // Get unread notifications
    const getUnreadNotifications = useCallback((): INotification[] => {
        return notifications.filter(n => !n.read);
    }, [notifications]);

    // Get notifications by type
    const getNotificationsByType = useCallback((type: NotificationType): INotification[] => {
        return notifications.filter(n => n.type === type);
    }, [notifications]);

    // Get notifications by priority
    const getNotificationsByPriority = useCallback((priority: NotificationPriority): INotification[] => {
        return notifications.filter(n => n.priority === priority);
    }, [notifications]);

    // Search notifications
    const searchNotifications = useCallback((query: string): INotification[] => {
        const lowercaseQuery = query.toLowerCase();
        return notifications.filter(n =>
            n.title.toLowerCase().includes(lowercaseQuery) ||
            n.message.toLowerCase().includes(lowercaseQuery) ||
            n.body?.toLowerCase().includes(lowercaseQuery)
        );
    }, [notifications]);

    // Filter notifications
    const filterNotifications = useCallback((filters: INotificationFilters): INotification[] => {
        return notifications.filter(n => {
            // Type filter
            if (filters.types && !filters.types.includes(n.type)) {
                return false;
            }

            // Priority filter
            if (filters.priorities && !filters.priorities.includes(n.priority)) {
                return false;
            }

            // Read status filter
            if (filters.readStatus) {
                if (filters.readStatus === 'read' && !n.read) return false;
                if (filters.readStatus === 'unread' && n.read) return false;
            }

            // Date range filter
            if (filters.dateRange) {
                const notificationDate = n.timestamp;
                if (notificationDate < filters.dateRange.start || notificationDate > filters.dateRange.end) {
                    return false;
                }
            }

            // Search query filter
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                if (!n.title.toLowerCase().includes(query) &&
                    !n.message.toLowerCase().includes(query) &&
                    !n.body?.toLowerCase().includes(query)) {
                    return false;
                }
            }

            // Tags filter
            if (filters.tags && filters.tags.length > 0) {
                const notificationTags = n.metadata?.tags || [];
                if (!filters.tags.some(tag => notificationTags.includes(tag))) {
                    return false;
                }
            }

            return true;
        });
    }, [notifications]);

    // Update configuration
    const updateConfig = useCallback((newConfig: Partial<INotificationConfig>): void => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    // Play notification sound
    const playNotificationSound = useCallback((type: NotificationType): void => {
        if (!config.enableSound || !config.soundEnabled) return;

        try {
            // Initialize audio context if needed
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const audioContext = audioContextRef.current;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Different sounds for different types
            const frequencies = {
                message: 800,
                mention: 1000,
                reaction: 600,
                system: 400,
                presence: 500,
                error: 300,
                warning: 350,
                success: 900,
                info: 700
            };

            oscillator.frequency.value = frequencies[type] || 600;
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    }, [config.enableSound, config.soundEnabled]);

    // Vibrate device
    const vibrate = useCallback((pattern: number[]): void => {
        if (!config.vibrationEnabled || !('vibrate' in navigator)) return;

        try {
            navigator.vibrate(pattern);
        } catch (error) {
            console.error('Error vibrating device:', error);
        }
    }, [config.vibrationEnabled]);

    // Request notification permission
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!('Notification' in window)) {
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }, []);

    // Send desktop notification
    const sendDesktopNotification = useCallback((notification: INotification): void => {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }

        try {
            const desktopNotification = new Notification(notification.title, {
                body: notification.message,
                icon: notification.sender?.avatar || '/favicon.ico',
                tag: notification.id,
                requireInteraction: notification.priority === 'critical'
            });

            desktopNotification.onclick = () => {
                window.focus();
                desktopNotification.close();

                // Mark as read
                markAsRead(notification.id);

                // Handle action URL
                if (notification.metadata?.actionUrl) {
                    window.location.href = notification.metadata.actionUrl;
                }
            };

            // Auto-close after 5 seconds for non-critical notifications
            if (notification.priority !== 'critical') {
                setTimeout(() => {
                    desktopNotification.close();
                }, 5000);
            }
        } catch (error) {
            console.error('Error sending desktop notification:', error);
        }
    }, [markAsRead]);

    // Calculate unread count
    const unreadCount = notifications.filter(n => !n.read).length;

    // WebSocket message handling
    useEffect(() => {
        if (!config.enableRealTimeNotifications) return;

        const unsubscribe = subscribe('notification', {
            onMessage: (message: any) => {
                if (message.type === 'notification') {
                    addNotification({
                        type: message.data.type || 'info',
                        title: message.data.title || 'New Notification',
                        message: message.data.message || '',
                        priority: message.data.priority || 'medium',
                        sender: message.data.sender,
                        metadata: message.data.metadata,
                        read: false
                    });
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, [config.enableRealTimeNotifications, addNotification, subscribe]);

    // Request permission on mount
    useEffect(() => {
        if (config.enableDesktopNotifications) {
            requestPermission();
        }
    }, [config.enableDesktopNotifications, requestPermission]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Clear all timeouts
            notificationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
            notificationTimeoutsRef.current.clear();

            // Close audio context
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Context value
    const contextValue: INotificationContextType = {
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
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * Hook to use notification context
 */
export const useRealTimeNotifications = (): INotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useRealTimeNotifications must be used within a RealTimeNotificationManager');
    }
    return context;
};

/**
 * Notification Bell Component
 */
export const NotificationBell: React.FC<{
    className?: string;
    onClick?: () => void;
}> = ({ className, onClick }) => {
    const { unreadCount } = useRealTimeNotifications();
    const theme = useTheme();

    return (
        <Container
            className={`notification-bell ${className || ''}`}
            onClick={onClick}
            style={{
                position: 'relative',
                cursor: 'pointer',
                padding: theme.spacing.sm
            }}
        >
            <Text variant="h6">🔔</Text>
            {unreadCount > 0 && (
                <Container
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: theme.colors.semantic.error,
                        color: theme.colors.text.primary,
                        borderRadius: theme.radius.full,
                        minWidth: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.bold
                    }}
                >
                    {unreadCount > 99 ? '99+' : unreadCount}
                </Container>
            )}
        </Container>
    );
};

/**
 * Notification Item Component
 */
export const NotificationItem: React.FC<{
    notification: INotification;
    onRead?: (id: string) => void;
    onRemove?: (id: string) => void;
}> = ({ notification, onRead, onRemove }) => {
    const theme = useTheme();

    return (
        <Container
            style={{
                padding: theme.spacing.md,
                borderBottom: `1px solid ${theme.colors.border.light}`,
                backgroundColor: notification.read
                    ? theme.colors.background.primary
                    : theme.colors.background.secondary,
                cursor: 'pointer',
                transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.easeOut}`
            }}
        >
            <Container style={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.md }}>
                {/* Notification icon */}
                <Container style={{ fontSize: '24px' }}>
                    {notification.type === 'message' && '💬'}
                    {notification.type === 'mention' && '@'}
                    {notification.type === 'reaction' && '❤️'}
                    {notification.type === 'system' && '⚙️'}
                    {notification.type === 'presence' && '👤'}
                    {notification.type === 'error' && '❌'}
                    {notification.type === 'warning' && '⚠️'}
                    {notification.type === 'success' && '✅'}
                    {notification.type === 'info' && 'ℹ️'}
                </Container>

                {/* Notification content */}
                <Container style={{ flex: 1 }}>
                    <Container style={{ marginBottom: theme.spacing.xs }}>
                        <Text
                            variant="h6"
                            fontWeight={notification.read ? 'normal' : 'bold'}
                        >
                            {notification.title}
                        </Text>
                    </Container>

                    <Text variant="body2" color="textSecondary">
                        {notification.message}
                    </Text>

                    {notification.body && (
                        <Container style={{ marginTop: theme.spacing.xs }}>
                            <Text variant="body2" color="textSecondary">
                                {notification.body}
                            </Text>
                        </Container>
                    )}

                    <Container style={{ marginTop: theme.spacing.xs }}>
                        <Text variant="caption" color="textSecondary">
                            {notification.timestamp.toLocaleString()}
                        </Text>
                    </Container>
                </Container>

                {/* Actions */}
                <Container style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
                    {!notification.read && (
                        <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => onRead?.(notification.id)}
                        >
                            ✓
                        </Button>
                    )}

                    <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => onRemove?.(notification.id)}
                    >
                        ×
                    </Button>
                </Container>
            </Container>
        </Container>
    );
};

export default RealTimeNotificationManager;
