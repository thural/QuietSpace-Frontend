import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/zustand';
import AuthGuard from '@/shared/auth/AuthGuard';
import ProtectedRoute from '@/shared/auth/ProtectedRoute';

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
export const EnterpriseRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* === LAYER 1: PUBLIC ROUTES === */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
        
        {/* === LAYER 2: AUTH ROUTES (Unauthenticated Only) === */}
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
        
        {/* === LAYER 3: PROTECTED ROUTES (Authentication Required) === */}
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
        
        {/* === LAYER 4: ROLE-BASED ROUTES === */}
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
        
        {/* === LAYER 5: ERROR ROUTES === */}
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        <Route path="/404" element={<div>Page Not Found</div>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default EnterpriseRoutes;
