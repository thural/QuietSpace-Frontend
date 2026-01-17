import 'reflect-metadata';
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithDI, createTestContainer } from '../../../../shared/utils/testUtils';
import { NotificationService } from '../../application/services/NotificationServiceDI';
import { NotificationRepository } from '../../data/NotificationRepository';
import { NotificationCenter } from '../components/NotificationCenter';

// Mock the DI container
const mockContainer = createTestContainer([
  { service: NotificationRepository },
  { service: NotificationService }
]);

describe('Notification Integration Tests', () => {
  const testUserId = 'test-user-123';

  beforeEach(() => {
    // Reset mocks and setup test environment
    jest.clearAllMocks();
  });

  it('should render notification center with empty state', async () => {
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('📭 No notifications found')).toBeInTheDocument();
    });
  });

  it('should display notification badges correctly', async () => {
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    // Badge should appear when there are unread notifications
    const notificationService = mockContainer.resolve(NotificationService);
    await notificationService.createNotification({
      userId: testUserId,
      type: 'message',
      title: 'Test Message',
      message: 'This is a test message',
      read: false,
      priority: 'medium'
    });

    // Re-render to show badge
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    await waitFor(() => {
      const badge = screen.getByText('1');
      expect(badge).toBeInTheDocument();
    });
  });

  it('should handle notification actions correctly', async () => {
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    const notificationService = mockContainer.resolve(NotificationService);
    
    // Create a test notification
    const notification = await notificationService.createNotification({
      userId: testUserId,
      type: 'message',
      title: 'Test Message',
      message: 'This is a test message',
      read: false,
      priority: 'medium'
    });

    // Re-render to show the notification
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    await waitFor(() => {
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    // Test mark as read action
    const markAsReadButton = screen.getByText('✓');
    fireEvent.click(markAsReadButton);

    await waitFor(() => {
      const updatedNotification = notificationService.getNotification(notification.id);
      expect(updatedNotification?.read).toBe(true);
    });
  });

  it('should filter notifications correctly', async () => {
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    const notificationService = mockContainer.resolve(NotificationService);
    
    // Create notifications of different types
    await notificationService.createNotification({
      userId: testUserId,
      type: 'message',
      title: 'Test Message',
      message: 'This is a test message',
      read: false,
      priority: 'medium'
    });

    await notificationService.createNotification({
      userId: testUserId,
      type: 'follow',
      title: 'New Follower',
      message: 'Someone followed you',
      read: false,
      priority: 'low'
    });

    // Re-render to show notifications
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    await waitFor(() => {
      expect(screen.getByText('Test Message')).toBeInTheDocument();
      expect(screen.getByText('New Follower')).toBeInTheDocument();
    });

    // Test type filter
    const typeFilter = screen.getByDisplayValue('All Types');
    fireEvent.change(typeFilter, { target: { value: 'message' } });

    await waitFor(() => {
      expect(screen.getByText('Test Message')).toBeInTheDocument();
      expect(screen.queryByText('New Follower')).not.toBeInTheDocument();
    });
  });

  it('should handle notification simulation', async () => {
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    // Open simulation dropdown
    const simulationButton = screen.getByText('⚡');
    fireEvent.click(simulationButton);

    await waitFor(() => {
      expect(screen.getByText('Simulate Notifications')).toBeInTheDocument();
    });

    // Simulate a message notification
    const messageButton = screen.getByText('💬 message');
    fireEvent.click(messageButton);

    await waitFor(() => {
      expect(screen.getByText('New message from John Doe')).toBeInTheDocument();
    });
  });

  it('should handle error states correctly', async () => {
    // Mock a service that throws an error
    const errorContainer = createTestContainer([
      { service: NotificationRepository, implementation: {
        getNotificationsByUserId: jest.fn().mockRejectedValue(new Error('Network error'))
      }},
      { service: NotificationService }
    ]);

    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: errorContainer
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch notifications')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    // Test retry functionality
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // Should attempt to fetch again
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('should handle batch operations correctly', async () => {
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    const notificationService = mockContainer.resolve(NotificationService);
    
    // Create multiple notifications
    await notificationService.createBatchNotifications([
      {
        userId: testUserId,
        type: 'message',
        title: 'Message 1',
        message: 'First message',
        priority: 'medium'
      },
      {
        userId: testUserId,
        type: 'follow',
        title: 'Follow 1',
        message: 'First follow',
        priority: 'low'
      }
    ]);

    // Re-render to show notifications
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    await waitFor(() => {
      expect(screen.getByText('Message 1')).toBeInTheDocument();
      expect(screen.getByText('Follow 1')).toBeInTheDocument();
    });

    // Test mark all as read
    const markAllReadButton = screen.getByText('Mark all read');
    fireEvent.click(markAllReadButton);

    await waitFor(() => {
      const stats = notificationService.getStats(testUserId);
      expect(stats).resolves.toMatchObject({
        unreadCount: 0,
        readCount: 2
      });
    });
  });

  it('should handle notification deletion correctly', async () => {
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    const notificationService = mockContainer.resolve(NotificationService);
    
    // Create a notification
    const notification = await notificationService.createNotification({
      userId: testUserId,
      type: 'message',
      title: 'Test Message',
      message: 'This is a test message',
      read: false,
      priority: 'medium'
    });

    // Re-render to show the notification
    renderWithDI(<NotificationCenter userId={testUserId} />, {
      diContainer: mockContainer
    });

    await waitFor(() => {
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    // Test delete action
    const deleteButton = screen.getByText('🗑️');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
    });
  });
});
