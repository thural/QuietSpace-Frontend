/**
 * Shared Module Index.
 * 
 * Barrel exports for all shared components and logic.
 * Provides centralized access to global entities, data, application, and presentation.
 */

// Domain
export { User } from './domain/entities/User';

// Application
export { useAuthStore, initializeAuthStore } from './application/auth/authStore';

// Presentation
export { UserAvatar } from './presentation/widgets/UserAvatar';
