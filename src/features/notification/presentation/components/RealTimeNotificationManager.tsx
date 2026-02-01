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

import { Container, Button, Text, Avatar } from '@/shared/ui/components';
import { useTheme } from '@/core/theme';
import { useEnterpriseWebSocket } from '@/core/websocket/hooks/useEnterpriseWebSocket';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from "@/shared/components/base/BaseClassComponent";
import { ReactNode } from "react";

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
    metadata?: Record<string, any>;
    actions?: Array<{
        id: string;
        label: string;
        action: () => void;
        variant?: 'primary' | 'secondary' | 'danger';
    }>;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

/**
 * Notification context interface
 */
export interface INotificationContext {
    notifications: INotification[];
    unreadCount: number;
    addNotification: (notification: Omit<INotification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotification: (id: string) => void;
    clearAllNotifications: () => void;
    setPriority: (id: string, priority: NotificationPriority) => void;
}

export interface IRealTimeNotificationManagerProps extends IBaseComponentProps {
    userId: string;
    maxNotifications?: number;
    enableWebSocket?: boolean;
    enableSound?: boolean;
    enableDesktop?: boolean;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface IRealTimeNotificationManagerState extends IBaseComponentState {
    notifications: INotification[];
    unreadCount: number;
    websocketHook: any;
    theme: any;
    isWebSocketConnected: boolean;
    soundEnabled: boolean;
    desktopEnabled: boolean;
    notificationQueue: INotification[];
    maxNotifications: number;
    position: string;
    autoCloseTimers: Map<string, NodeJS.Timeout>;
}

/**
 * Enterprise Real-Time Notification Manager component.
 * 
 * This component provides advanced real-time notification management with priority handling,
 * notification queuing, and comprehensive notification types. It integrates with WebSocket
 * for real-time updates and supports desktop notifications.
 * 
 * Converted to class-based component following enterprise patterns.
 */
class RealTimeNotificationManager extends BaseClassComponent<IRealTimeNotificationManagerProps, IRealTimeNotificationManagerState> {

    protected override getInitialState(): Partial<IRealTimeNotificationManagerState> {
        return {
            notifications: [],
            unreadCount: 0,
            websocketHook: null,
            theme: null,
            isWebSocketConnected: false,
            soundEnabled: true,
            desktopEnabled: true,
            notificationQueue: [],
            maxNotifications: 10,
            position: 'top-right',
            autoCloseTimers: new Map()
        };
    }

    protected override onMount(): void {
        super.onMount();
        this.initializeNotifications();
    }

    protected override onUnmount(): void {
        super.onUnmount();
        // Clear all auto-close timers
        this.state.autoCloseTimers.forEach(timer => clearTimeout(timer));
    }

    protected override onUpdate(): void {
        this.updateNotificationState();
    }

    /**
     * Initialize notification system
     */
    private initializeNotifications = (): void => {
        const { userId, maxNotifications = 10, enableWebSocket = true, enableSound = true, enableDesktop = true, position = 'top-right' } = this.props;

        const theme = useTheme();
        const websocketHook = enableWebSocket ? useEnterpriseWebSocket(userId) : null;

        this.safeSetState({
            theme,
            websocketHook,
            maxNotifications,
            soundEnabled: enableSound,
            desktopEnabled: enableDesktop,
            position
        });

        this.updateNotificationState();
    };

    /**
     * Update notification state from hooks
     */
    private updateNotificationState = (): void => {
        if (this.state.websocketHook) {
            const { isConnected, lastMessage } = this.state.websocketHook;

            this.safeSetState({
                isWebSocketConnected: isConnected
            });

            // Handle WebSocket messages
            if (lastMessage && lastMessage.type === 'notification') {
                this.handleWebSocketNotification(lastMessage.data);
            }
        }
    };

    /**
     * Handle WebSocket notification
     */
    private handleWebSocketNotification = (notificationData: any): void => {
        const notification: Omit<INotification, 'id' | 'timestamp' | 'read'> = {
            type: notificationData.type || 'info',
            title: notificationData.title || 'New Notification',
            message: notificationData.message || '',
            priority: notificationData.priority || 'medium',
            sender: notificationData.sender,
            recipient: notificationData.recipient,
            metadata: notificationData.metadata,
            actions: notificationData.actions,
            autoClose: notificationData.autoClose !== false,
            autoCloseDelay: notificationData.autoCloseDelay || 5000
        };

        this.addNotification(notification);
    };

    /**
     * Add notification
     */
    private addNotification = (notificationData: Omit<INotification, 'id' | 'timestamp' | 'read'>): void => {
        const notification: INotification = {
            ...notificationData,
            id: this.generateNotificationId(),
            timestamp: new Date(),
            read: false
        };

        this.safeSetState(prev => {
            const newNotifications = [...prev.notifications, notification];
            const filteredNotifications = this.filterNotifications(newNotifications);
            const unreadCount = filteredNotifications.filter(n => !n.read).length;

            // Play sound if enabled
            if (this.state.soundEnabled) {
                this.playNotificationSound(notification);
            }

            // Show desktop notification if enabled
            if (this.state.desktopEnabled) {
                this.showDesktopNotification(notification);
            }

            // Set auto-close timer
            if (notification.autoClose) {
                this.setAutoCloseTimer(notification);
            }

            return {
                notifications: filteredNotifications,
                unreadCount
            };
        });
    };

    /**
     * Generate notification ID
     */
    private generateNotificationId = (): string => {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    /**
     * Filter notifications based on max count and priority
     */
    private filterNotifications = (notifications: INotification[]): INotification[] => {
        const { maxNotifications } = this.state;

        if (notifications.length <= maxNotifications) {
            return notifications;
        }

        // Sort by priority and timestamp, keeping the most important ones
        return notifications
            .sort((a, b) => {
                const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                if (priorityDiff !== 0) return priorityDiff;
                return b.timestamp.getTime() - a.timestamp.getTime();
            })
            .slice(0, maxNotifications);
    };

    /**
     * Play notification sound
     */
    private playNotificationSound = (notification: INotification): void => {
        try {
            const audio = new Audio('/notification-sound.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Ignore audio play errors
            });
        } catch (error) {
            // Ignore audio errors
        }
    };

    /**
     * Show desktop notification
     */
    private showDesktopNotification = (notification: INotification): void => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: notification.sender?.avatar || '/notification-icon.png',
                tag: notification.id,
                requireInteraction: notification.priority === 'critical'
            });
        }
    };

    /**
     * Set auto-close timer
     */
    private setAutoCloseTimer = (notification: INotification): void => {
        const timer = setTimeout(() => {
            this.markAsRead(notification.id);
        }, notification.autoCloseDelay);

        this.safeSetState(prev => ({
            autoCloseTimers: new Map(prev.autoCloseTimers).set(notification.id, timer)
        }));
    };

    /**
     * Mark notification as read
     */
    private markAsRead = (id: string): void => {
        this.safeSetState(prev => {
            const notifications = prev.notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            );
            const unreadCount = notifications.filter(n => !n.read).length;

            // Clear auto-close timer
            const timer = prev.autoCloseTimers.get(id);
            if (timer) {
                clearTimeout(timer);
                const newTimers = new Map(prev.autoCloseTimers);
                newTimers.delete(id);
                return { notifications, unreadCount, autoCloseTimers: newTimers };
            }

            return { notifications, unreadCount };
        });
    };

    /**
     * Mark all notifications as read
     */
    private markAllAsRead = (): void => {
        this.safeSetState(prev => {
            const notifications = prev.notifications.map(n => ({ ...n, read: true }));

            // Clear all auto-close timers
            prev.autoCloseTimers.forEach(timer => clearTimeout(timer));

            return {
                notifications,
                unreadCount: 0,
                autoCloseTimers: new Map()
            };
        });
    };

    /**
     * Clear notification
     */
    private clearNotification = (id: string): void => {
        this.safeSetState(prev => {
            const notifications = prev.notifications.filter(n => n.id !== id);
            const unreadCount = notifications.filter(n => !n.read).length;

            // Clear auto-close timer
            const timer = prev.autoCloseTimers.get(id);
            if (timer) {
                clearTimeout(timer);
                const newTimers = new Map(prev.autoCloseTimers);
                newTimers.delete(id);
                return { notifications, unreadCount, autoCloseTimers: newTimers };
            }

            return { notifications, unreadCount };
        });
    };

    /**
     * Clear all notifications
     */
    private clearAllNotifications = (): void => {
        this.safeSetState(prev => {
            // Clear all auto-close timers
            prev.autoCloseTimers.forEach(timer => clearTimeout(timer));

            return {
                notifications: [],
                unreadCount: 0,
                autoCloseTimers: new Map()
            };
        });
    };

    /**
     * Set notification priority
     */
    private setPriority = (id: string, priority: NotificationPriority): void => {
        this.safeSetState(prev => {
            const notifications = prev.notifications.map(n =>
                n.id === id ? { ...n, priority } : n
            );
            return { notifications };
        });
    };

    /**
     * Get notification icon
     */
    private getNotificationIcon = (type: NotificationType): string => {
        const icons = {
            message: '💬',
            mention: '@',
            reaction: '❤️',
            system: '⚙️',
            presence: '👤',
            error: '❌',
            warning: '⚠️',
            success: '✅',
            info: 'ℹ️'
        };
        return icons[type] || '📢';
    };

    /**
     * Get notification color
     */
    private getNotificationColor = (priority: NotificationPriority): string => {
        const colors = {
            critical: '#ef4444',
            high: '#f59e0b',
            medium: '#3b82f6',
            low: '#10b981'
        };
        return colors[priority] || '#6b7280';
    };

    protected override renderContent(): ReactNode {
        const { notifications, unreadCount, position } = this.state;

        if (notifications.length === 0) {
            return null;
        }

        const positionStyles = {
            'top-right': { top: '20px', right: '20px' },
            'top-left': { top: '20px', left: '20px' },
            'bottom-right': { bottom: '20px', right: '20px' },
            'bottom-left': { bottom: '20px', left: '20px' }
        };

        return (
            <div
                style={{
                    position: 'fixed',
                    zIndex: 9999,
                    ...positionStyles[position],
                    maxWidth: '400px',
                    width: '100%'
                }}
            >
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        style={{
                            backgroundColor: notification.read ? '#f3f4f6' : '#ffffff',
                            border: `1px solid ${this.getNotificationColor(notification.priority)}`,
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out'
                        }}
                        onClick={() => this.markAsRead(notification.id)}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ fontSize: '20px' }}>
                                {this.getNotificationIcon(notification.type)}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                    <Text variant="h6" style={{ margin: 0, fontWeight: 'bold' }}>
                                        {notification.title}
                                    </Text>
                                    {!notification.read && (
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: this.getNotificationColor(notification.priority)
                                        }} />
                                    )}
                                </div>

                                <Text variant="body2" style={{ margin: 0, color: '#4b5563' }}>
                                    {notification.message}
                                </Text>

                                {notification.sender && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                        <Avatar
                                            src={notification.sender.avatar}
                                            name={notification.sender.name}
                                            size="small"
                                        />
                                        <Text variant="caption" style={{ color: '#6b7280' }}>
                                            {notification.sender.name}
                                        </Text>
                                    </div>
                                )}

                                {notification.actions && (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                        {notification.actions.map(action => (
                                            <Button
                                                key={action.id}
                                                variant={action.variant || 'secondary'}
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    action.action();
                                                }}
                                            >
                                                {action.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{
                            fontSize: '10px',
                            color: '#9ca3af',
                            marginTop: '8px',
                            textAlign: 'right'
                        }}>
                            {notification.timestamp.toLocaleTimeString()}
                        </div>
                    </div>
                ))}

                {unreadCount > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                )}
            </div>
        );
    }
}

export default RealTimeNotificationManager;