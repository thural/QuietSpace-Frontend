/**
 * Authentication Guards Barrel Export
 * 
 * Exports all authentication guard components including:
 * - Route-level authentication guards
 * - Permission-based route protection
 * - Higher-order component authentication
 * - Enterprise routing patterns
 */

// Core Guards
export { AuthGuard } from './AuthGuard';
export { ProtectedRoute } from './ProtectedRoute';
export { withAuth, useAuth, PermissionGate } from './withAuth';

// Enterprise Routing
export { EnterpriseRoutes } from './EnterpriseRoutesPattern';
