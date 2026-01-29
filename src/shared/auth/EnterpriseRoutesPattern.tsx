import React, { Component, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, AuthState, User } from '@/core/store/zustand';
import AuthGuard from '@/shared/auth/AuthGuard';
import ProtectedRoute from '@/shared/auth/ProtectedRoute';

// ✅ DO: Define strict TypeScript interfaces
interface IEnterpriseRoutesProps { }

interface IEnterpriseRoutesState {
  isAuthenticated: boolean;
  user: User | null;
  isInitialized: boolean;
}

/**
 * Enterprise-grade route configuration with layered authentication
 * 
 * Architecture Pattern:
 * 
 * 1. PUBLIC ROUTES
 *    - No authentication required
 *    - Accessible by anyone
 *    - Examples: Home, About, Contact
 * 
 * 2. AUTH ROUTES (Unauthenticated Only)
 *    - Only for users NOT logged in
 *    - Redirect authenticated users to dashboard
 *    - Examples: Login, Register, Forgot Password
 * 
 * 3. PROTECTED ROUTES (Authentication Required)
 *    - Only for authenticated users
 *    - Redirect unauthenticated to login
 *    - Examples: Dashboard, Profile, Settings
 * 
 * 4. ROLE-BASED ROUTES
 *    - Require specific permissions
 *    - Show unauthorized if insufficient permissions
 *    - Examples: Admin Panel, User Management
 * 
 * 5. ERROR ROUTES
 *    - Handle 404, unauthorized, etc.
 *    - Provide user-friendly error pages
 */
export class EnterpriseRoutes extends Component<IEnterpriseRoutesProps, IEnterpriseRoutesState> {
  // ✅ DO: Use private properties for services
  private unsubscribe?: () => void;

  // ✅ DO: Constructor with method binding
  constructor(props: IEnterpriseRoutesProps) {
    super(props);

    // ✅ DO: Initialize state properly
    this.state = {
      isAuthenticated: false,
      user: null,
      isInitialized: false
    };
  }

  // ✅ DO: Group lifecycle methods
  componentDidMount(): void {
    this.initializeAuth();
  }

  componentWillUnmount(): void {
    // ✅ DO: Cleanup subscriptions
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // ✅ DO: Extract complex logic into private methods
  private initializeAuth = (): void => {
    // Get initial auth state using the hook directly
    const authState = useAuthStore.getState();

    this.setState({
      isAuthenticated: authState.isAuthenticated,
      user: authState.user,
      isInitialized: true
    });

    // Subscribe to auth changes using Zustand's subscribe method
    this.unsubscribe = useAuthStore.subscribe((state) => {
      this.setState({
        isAuthenticated: state.isAuthenticated,
        user: state.user
      });
    });
  };

  // ✅ DO: Extract render helpers for clean JSX
  private renderPublicRoutes = (): React.ReactNode => (
    <>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/about" element={<div>About Page</div>} />
      <Route path="/contact" element={<div>Contact Page</div>} />
    </>
  );

  private renderAuthRoutes = (): React.ReactNode => (
    <Route
      path="/auth"
      element={
        <AuthGuard requireAuth={false}>
          <Routes>
            <Route path="login" element={<div>Login Page</div>} />
            <Route path="register" element={<div>Register Page</div>} />
            <Route path="forgot-password" element={<div>Forgot Password Page</div>} />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </AuthGuard>
      }
    />
  );

  private renderProtectedRoutes = (): React.ReactNode => (
    <Route
      path="/app"
      element={
        <AuthGuard requireAuth={true}>
          <Routes>
            <Route path="dashboard" element={<div>Dashboard</div>} />
            <Route path="profile" element={<div>Profile</div>} />
            <Route path="settings" element={<div>Settings</div>} />
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </AuthGuard>
      }
    />
  );

  private renderRoleBasedRoutes = (): React.ReactNode => (
    <Route
      path="/admin"
      element={
        <ProtectedRoute requiredPermissions={['system:admin']}>
          <Routes>
            <Route path="panel" element={<div>Admin Panel</div>} />
            <Route path="users" element={<div>User Management</div>} />
            <Route path="settings" element={<div>System Settings</div>} />
            <Route path="*" element={<Navigate to="/admin/panel" replace />} />
          </Routes>
        </ProtectedRoute>
      }
    />
  );

  private renderErrorRoutes = (): React.ReactNode => (
    <>
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      <Route path="/404" element={<div>Page Not Found</div>} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </>
  );

  private renderLoadingState = (): React.ReactNode => (
    <div>Loading routes...</div>
  );

  // ✅ DO: Keep render method clean and focused
  render(): React.ReactNode {
    // ✅ DO: Destructure state for readability
    const { isInitialized } = this.state;

    // ✅ DO: Handle initialization state
    if (!isInitialized) {
      return this.renderLoadingState();
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* === LAYER 1: PUBLIC ROUTES === */}
          {this.renderPublicRoutes()}

          {/* === LAYER 2: AUTH ROUTES (Unauthenticated Only) === */}
          {this.renderAuthRoutes()}

          {/* === LAYER 3: PROTECTED ROUTES (Authentication Required) === */}
          {this.renderProtectedRoutes()}

          {/* === LAYER 4: ROLE-BASED ROUTES === */}
          {this.renderRoleBasedRoutes()}

          {/* === LAYER 5: ERROR ROUTES === */}
          {this.renderErrorRoutes()}
        </Routes>
      </Suspense>
    );
  }
}

export default EnterpriseRoutes;
