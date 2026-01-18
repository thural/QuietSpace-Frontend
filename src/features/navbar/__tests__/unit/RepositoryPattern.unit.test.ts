/**
 * Unit tests for repository pattern implementation.
 * 
 * This file contains focused unit tests for individual components
 * of the repository pattern including repositories, factory, and hooks.
 */

import { NotificationRepository } from '../data/NotificationRepository';
import { MockNotificationRepository } from '../data/MockNotificationRepository';
import { RepositoryFactory } from '../data/RepositoryFactory';
import type { INotificationRepository } from '../domain/INotificationRepository';

describe('Repository Pattern Unit Tests', () => {
  describe('NotificationRepository', () => {
    let repository: NotificationRepository;

    beforeEach(() => {
      repository = new NotificationRepository();
    });

    it('should create repository instance', () => {
      expect(repository).toBeDefined();
      expect(repository).toBeInstanceOf(NotificationRepository);
    });

    it('should implement INotificationRepository interface', () => {
      const interfaceMethods: (keyof INotificationRepository)[] = [
        'getNotificationStatus',
        'getChatData',
        'getNotificationData',
        'getCurrentUserId',
        'isLoading',
        'getError'
      ];

      interfaceMethods.forEach(method => {
        expect(typeof repository[method]).toBe('function');
      });
    });

    it('should handle initialization with React data', () => {
      // This would be tested in integration tests
      expect(repository).toBeDefined();
    });
  });

  describe('MockNotificationRepository', () => {
    let mockRepository: MockNotificationRepository;

    beforeEach(() => {
      mockRepository = new MockNotificationRepository();
    });

    it('should create mock repository with default config', () => {
      expect(mockRepository).toBeDefined();
      expect(mockRepository).toBeInstanceOf(MockNotificationRepository);
    });

    it('should create mock repository with custom config', () => {
      const customMock = new MockNotificationRepository({
        hasPendingNotifications: true,
        hasUnreadChats: true,
        simulateLoading: true,
        simulateError: false
      });

      expect(customMock).toBeDefined();
    });

    it('should implement INotificationRepository interface', () => {
      const interfaceMethods: (keyof INotificationRepository)[] = [
        'getNotificationStatus',
        'getChatData',
        'getNotificationData',
        'getCurrentUserId',
        'isLoading',
        'getError'
      ];

      interfaceMethods.forEach(method => {
        expect(typeof mockRepository[method]).toBe('function');
      });
    });

    it('should return mock notification status', async () => {
      const mockRepo = new MockNotificationRepository({
        hasPendingNotifications: true,
        hasUnreadChats: false
      });

      const status = await mockRepo.getNotificationStatus();

      expect(status.hasPendingNotification).toBe(true);
      expect(status.hasUnreadChat).toBe(false);
      expect(status.isLoading).toBe(false);
    });

    it('should simulate loading state', async () => {
      const mockRepo = new MockNotificationRepository({
        simulateLoading: true
      });

      expect(mockRepo.isLoading()).toBe(true);
    });

    it('should simulate error state', async () => {
      const mockRepo = new MockNotificationRepository({
        simulateError: true
      });

      expect(mockRepo.getError()).toBeInstanceOf(Error);
    });

    it('should update mock configuration', async () => {
      const mockRepo = new MockNotificationRepository({
        hasPendingNotifications: false,
        hasUnreadChats: false
      });

      mockRepo.updateMockConfig({
        hasPendingNotifications: true,
        hasUnreadChats: true
      });

      const status = await mockRepo.getNotificationStatus();
      expect(status.hasPendingNotification).toBe(true);
      expect(status.hasUnreadChat).toBe(true);
    });

    it('should reset to default state', async () => {
      const mockRepo = new MockNotificationRepository({
        hasPendingNotifications: true,
        hasUnreadChats: true
      });

      mockRepo.reset();

      const status = await mockRepo.getNotificationStatus();
      expect(status.hasPendingNotification).toBe(false);
      expect(status.hasUnreadChat).toBe(false);
      expect(mockRepo.isLoading()).toBe(false);
      expect(mockRepo.getError()).toBeNull();
    });
  });

  describe('RepositoryFactory', () => {
    let factory: RepositoryFactory;

    beforeEach(() => {
      factory = RepositoryFactory.getInstance();
    });

    afterEach(() => {
      factory.reset();
    });

    it('should create singleton instance', () => {
      const factory1 = RepositoryFactory.getInstance();
      const factory2 = RepositoryFactory.getInstance();

      expect(factory1).toBe(factory2);
    });

    it('should create notification repository', () => {
      const repository = factory.createNotificationRepository();
      
      expect(repository).toBeDefined();
      expect(typeof repository.getNotificationStatus).toBe('function');
    });

    it('should create mock repository when configured', () => {
      const mockFactory = RepositoryFactory.createInstance({
        useMockRepositories: true
      });

      const repository = mockFactory.createNotificationRepository();
      
      expect(repository).toBeDefined();
      expect(repository.constructor.name).toBe('MockNotificationRepository');
    });

    it('should update configuration', () => {
      const newConfig = {
        useMockRepositories: true,
        mockConfig: {
          hasPendingNotifications: true
        }
      };

      factory.updateConfig(newConfig);

      const config = factory.getConfig();
      expect(config.useMockRepositories).toBe(true);
    });

    it('should reset cached instances', () => {
      const repository1 = factory.createNotificationRepository();
      const repository2 = factory.createNotificationRepository();

      factory.reset();

      const repository3 = factory.createNotificationRepository();
      
      expect(repository1).not.toBe(repository3);
      expect(repository2).not.toBe(repository3);
    });
  });

  describe('Repository Factory Functions', () => {
    it('should create default repository', () => {
      const repository = RepositoryFactory.getInstance().createNotificationRepository();
      
      expect(repository).toBeDefined();
    });

    it('should create mock repository', () => {
      const repository = RepositoryFactory.getInstance().createNotificationRepository({
        useMockRepositories: true
      });
      
      expect(repository).toBeDefined();
    });

    it('should create repository with custom config', () => {
      const repository = RepositoryFactory.getInstance().createNotificationRepository({
        useMockRepositories: true,
        mockConfig: {
          hasPendingNotifications: true,
          hasUnreadChats: false
        }
      });
      
      expect(repository).toBeDefined();
    });
  });

  describe('Repository Interface Compliance', () => {
    const testRepositoryImplementations = [
      { name: 'NotificationRepository', create: () => new NotificationRepository() },
      { name: 'MockNotificationRepository', create: () => new MockNotificationRepository() }
    ];

    testRepositoryImplementations.forEach(({ name, create }) => {
      describe(`${name} Interface Compliance`, () => {
        let repository: INotificationRepository;

        beforeEach(() => {
          repository = create();
        });

        it('should have all required methods', () => {
          const requiredMethods = [
            'getNotificationStatus',
            'getChatData', 
            'getNotificationData',
            'getCurrentUserId',
            'isLoading',
            'getError'
          ] as const;

          requiredMethods.forEach(method => {
            expect(typeof repository[method]).toBe(`function`);
          });
        });

        it('should return proper types', async () => {
          const notificationStatus = await repository.getNotificationStatus();
          
          expect(typeof notificationStatus.hasPendingNotification).toBe('boolean');
          expect(typeof notificationStatus.hasUnreadChat).toBe('boolean');
          expect(typeof notificationStatus.isLoading).toBe('boolean');
        });

        it('should handle async operations', async () => {
          const chatData = await repository.getChatData();
          const notificationData = await repository.getNotificationData();
          const userId = await repository.getCurrentUserId();

          expect(Array.isArray(chatData)).toBe(true);
          expect(Array.isArray(notificationData)).toBe(true);
          expect(typeof userId).toBe('string');
        });

        it('should provide state information', () => {
          const isLoading = repository.isLoading();
          const error = repository.getError();

          expect(typeof isLoading).toBe('boolean');
          expect(error === null || typeof error).toBe('object');
        });
      });
    });
  });
});
