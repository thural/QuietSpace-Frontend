/**
 * Chat Notification Manager - Enterprise Edition
 * 
 * This component provides chat-specific notification management that was previously
 * mixed within the chat feature. Now properly separated into the notification feature.
 * 
 * Features:
 * - Enterprise-grade notification management
 * - Chat-specific notification types
 * - Real-time updates
 * - Theme integration
 */

import { useTheme } from '@/core/theme';
import { Button, Container, Text } from '@/shared/ui/components';
import React, { createContext, useCallback, useContext, useState } from 'react';

/**
 * Chat notification interface
 */
export interface IChatNotification {
    id: string;
    chatId: string;
    type: 'new_message' | 'mention' | 'reaction' | 'user_joined' | 'user_left' | 'typing';
    title: string;
    message: string;
    sender?: {
        id: string;
        name: string;
        avatar?: string;
    };
    timestamp: Date;
    read: boolean;
    metadata?: {
        messageId?: string;
        preview?: string;
        actionUrl?: string;
    };
}

/**
 * Chat notification manager context
 */
interface IChatNotificationContextType {
    notifications: IChatNotification[];
    unreadCount: number;
    addNotification: (notification: Omit<IChatNotification, 'id' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    getNotificationsByChat: (chatId: string) => IChatNotification[];
}

/**
 * Chat notification context
 */
const ChatNotificationContext = createContext<IChatNotificationContextType | null>(null);

/**
 * Chat Notification Manager Props
 */
interface IChatNotificationManagerProps {
    children: React.ReactNode;
    userId: string;
}

/**
 * Enterprise Chat Notification Manager Component
 * 
 * Manages chat-specific notifications that were previously mixed
 * within the chat feature, now properly separated.
 */
export const ChatNotificationManager: React.FC<IChatNotificationManagerProps> = ({
    children,
    userId
}) => {
    const theme = useTheme();

    // State management
    const [notifications, setNotifications] = useState<IChatNotification[]>([]);

    // Generate unique notification ID
    const generateNotificationId = useCallback((): string => {
        return `chat-notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Add notification
    const addNotification = useCallback((
        notification: Omit<IChatNotification, 'id' | 'timestamp'>
    ): void => {
        const id = generateNotificationId();
        const timestamp = new Date();

        const newNotification: IChatNotification = {
            id,
            ...notification,
            timestamp,
            read: false
        };

        setNotifications(prev => [newNotification, ...prev]);
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

    // Clear notifications
    const clearNotifications = useCallback((): void => {
        setNotifications([]);
    }, []);

    // Get notifications by chat
    const getNotificationsByChat = useCallback((chatId: string): IChatNotification[] => {
        return notifications.filter(n => n.chatId === chatId);
    }, [notifications]);

    // Calculate unread count
    const unreadCount = notifications.filter(n => !n.read).length;

    // Context value
    const contextValue: IChatNotificationContextType = {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        getNotificationsByChat
    };

    return (
        <ChatNotificationContext.Provider value={contextValue}>
            {children}
        </ChatNotificationContext.Provider>
    );
};

/**
 * Hook to use chat notification context
 */
export const useChatNotifications = (): IChatNotificationContextType => {
    const context = useContext(ChatNotificationContext);
    if (!context) {
        throw new Error('useChatNotifications must be used within a ChatNotificationManager');
    }
    return context;
};

/**
 * Chat Notification Bell Component
 */
export const ChatNotificationBell: React.FC<{
    className?: string;
    onClick?: () => void;
}> = ({ className, onClick }) => {
    const { unreadCount } = useChatNotifications();
    const theme = useTheme();

    return (
        <Container
            className={`chat-notification-bell ${className || ''}`}
            onClick={onClick}
            style={{
                position: 'relative',
                cursor: 'pointer',
                padding: theme.spacing.sm
            }}
        >
            <Text variant="h6">💬</Text>
            {unreadCount > 0 && (
                <Container
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: theme.colors.brand[500],
                        color: theme.colors.text.inverse,
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
 * Chat Notification Item Component
 */
export const ChatNotificationItem: React.FC<{
    notification: IChatNotification;
    onRead?: (id: string) => void;
    onRemove?: (id: string) => void;
}> = ({ notification, onRead, onRemove }) => {
    const theme = useTheme();

    const getNotificationIcon = (type: string): string => {
        switch (type) {
            case 'new_message': return '💬';
            case 'mention': return '@';
            case 'reaction': return '❤️';
            case 'user_joined': return '👤';
            case 'user_left': return '👋';
            case 'typing': return '⌨️';
            default: return '💬';
        }
    };

    return (
        <Container
            style={{
                padding: theme.spacing.md,
                borderBottom: `1px solid ${theme.colors.border.medium}`,
                backgroundColor: notification.read
                    ? theme.colors.background.primary
                    : theme.colors.background.secondary,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
        >
            <Container style={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.md }}>
                {/* Notification icon */}
                <Container style={{ fontSize: '24px' }}>
                    {getNotificationIcon(notification.type)}
                </Container>

                {/* Notification content */}
                <Container style={{ flex: 1 }}>
                    <Container style={{ marginBottom: theme.spacing.xs }}>
                        <Text
                            variant="h6"
                            style={{
                                fontWeight: notification.read ? 'normal' : 'bold'
                            }}
                        >
                            {notification.title}
                        </Text>
                    </Container>

                    <Text variant="body2" color="textSecondary">
                        {notification.message}
                    </Text>

                    {notification.metadata?.preview && (
                        <Container style={{ marginTop: theme.spacing.xs }}>
                            <Text variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
                                "{notification.metadata.preview}"
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

/**
 * Chat Notification List Component
 */
export const ChatNotificationList: React.FC<{
    maxItems?: number;
    onNotificationClick?: (notification: IChatNotification) => void;
}> = ({ maxItems = 10, onNotificationClick }) => {
    const { notifications, markAsRead } = useChatNotifications();
    const theme = useTheme();

    const displayNotifications = notifications.slice(0, maxItems);

    if (displayNotifications.length === 0) {
        return (
            <Container style={{ padding: theme.spacing.lg }}>
                <Text variant="body1" color="textSecondary" textAlign="center">
                    No chat notifications
                </Text>
            </Container>
        );
    }

    return (
        <Container>
            {displayNotifications.map(notification => (
                <ChatNotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                    onRemove={() => {
                        // In a real implementation, this would remove the notification
                        console.log('Remove notification:', notification.id);
                    }}
                />
            ))}
        </Container>
    );
};

export default ChatNotificationManager;
