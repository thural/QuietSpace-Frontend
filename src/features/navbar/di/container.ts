/**
 * Navbar Feature DI Container.
 * 
 * This container provides dependency injection setup for the navbar feature
 * following the documented patterns with a simplified approach.
 */

import type { INotificationRepository } from '../domain/repositories/INotificationRepository';
import { NotificationRepository } from '../data/repositories/NotificationRepository';
import { MockNotificationRepository } from '../data/repositories/MockNotificationRepository';

// Service tokens for dependency injection
export const INotificationRepositoryToken = 'INotificationRepository';
export const INavbarServiceToken = 'INavbarService';
export const INavbarApplicationServiceToken = 'INavbarApplicationService';

// Service interfaces following documentation naming conventions
export interface INavbarService {
  getNotificationStatus(): Promise<any>;
  getNavigationItems(): Promise<any>;
}

export interface INavbarApplicationService {
  initializeNavbar(config?: NavbarConfig): Promise<void>;
  getNavbarState(): Promise<NavbarState>;
}

// Types following documentation patterns
export interface NavbarConfig {
  useRepositoryPattern?: boolean;
  repositoryConfig?: {
    useMockRepositories?: boolean;
    mockConfig?: {
      hasPendingNotifications?: boolean;
      hasUnreadChats?: boolean;
      simulateLoading?: boolean;
      simulateError?: boolean;
    };
  };
  enablePersistence?: boolean;
  syncInterval?: number;
}

export interface NavbarState {
  notificationData: any;
  navigationItems: any;
  error: Error | null;
  isLoading: boolean;
}

/**
 * Navbar Service - Domain service implementation
 */
export class NavbarService implements INavbarService {
  constructor(private notificationRepository: INotificationRepository) {}

  async getNotificationStatus(): Promise<any> {
    return await this.notificationRepository.getNotificationStatus();
  }

  async getNavigationItems(): Promise<any> {
    // Implementation for navigation items
    return {
      mainItems: [],
      chat: null,
      profile: null,
      notification: null
    };
  }
}

/**
 * Navbar Application Service - Application layer service
 */
export class NavbarApplicationService implements INavbarApplicationService {
  constructor(private navbarService: INavbarService) {}

  async initializeNavbar(config: NavbarConfig = {}): Promise<void> {
    // Initialize navbar with configuration
    console.log('Initializing navbar with config:', config);
  }

  async getNavbarState(): Promise<NavbarState> {
    try {
      const notificationData = await this.navbarService.getNotificationStatus();
      const navigationItems = await this.navbarService.getNavigationItems();

      return {
        notificationData,
        navigationItems,
        error: null,
        isLoading: false
      };
    } catch (error) {
      return {
        notificationData: null,
        navigationItems: null,
        error: error as Error,
        isLoading: false
      };
    }
  }
}

/**
 * Create Navbar DI Container
 * 
 * Sets up all navbar feature services with proper dependency injection
 * following the documented patterns.
 */
export const createNavbarContainer = (config: NavbarConfig = {}) => {
  // Create repository based on configuration
  let notificationRepository: INotificationRepository;
  if (config.repositoryConfig?.useMockRepositories) {
    notificationRepository = new MockNotificationRepository(config.repositoryConfig.mockConfig);
  } else {
    notificationRepository = new NotificationRepository();
  }

  // Create services
  const navbarService = new NavbarService(notificationRepository);
  const navbarApplicationService = new NavbarApplicationService(navbarService);

  return {
    notificationRepository,
    navbarService,
    navbarApplicationService
  };
};

/**
 * Default navbar container for production use
 */
export const defaultNavbarContainer = createNavbarContainer();

/**
 * Factory function for creating navbar containers with different configurations
 */
export const createNavbarContainerFactory = () => {
  return {
    createProduction: () => createNavbarContainer({ useRepositoryPattern: true }),
    createDevelopment: () => createNavbarContainer({ 
      useRepositoryPattern: true,
      repositoryConfig: { useMockRepositories: true }
    }),
    createTesting: (mockConfig?: any) => createNavbarContainer({
      useRepositoryPattern: true,
      repositoryConfig: { 
        useMockRepositories: true,
        mockConfig 
      }
    })
  };
};
