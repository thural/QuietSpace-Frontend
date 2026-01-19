// Permission constants for role-based access control

export const PERMISSIONS = {
    // Feed permissions
    READ_POSTS: 'read:posts',
    CREATE_POSTS: 'create:posts',
    EDIT_POSTS: 'edit:posts',
    DELETE_POSTS: 'delete:posts',
    
    // Comment permissions
    READ_COMMENTS: 'read:comments',
    CREATE_COMMENTS: 'create:comments',
    EDIT_COMMENTS: 'edit:comments',
    DELETE_COMMENTS: 'delete:comments',
    
    // Chat permissions
    READ_MESSAGES: 'read:messages',
    SEND_MESSAGES: 'send:messages',
    DELETE_MESSAGES: 'delete:messages',
    
    // Profile permissions
    VIEW_PROFILES: 'view:profiles',
    EDIT_PROFILE: 'edit:profile',
    DELETE_PROFILE: 'delete:profile',
    
    // Admin permissions
    MANAGE_USERS: 'manage:users',
    MANAGE_CONTENT: 'manage:content',
    VIEW_ANALYTICS: 'view:analytics',
    SYSTEM_ADMIN: 'system:admin',
    
    // Notification permissions
    READ_NOTIFICATIONS: 'read:notifications',
    MANAGE_NOTIFICATIONS: 'manage:notifications',
    
    // Search permissions
    SEARCH_CONTENT: 'search:content',
    ADVANCED_SEARCH: 'search:advanced',
} as const;

export const ROLES = {
    GUEST: 'guest',
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
} as const;

// Helper function to get base permissions for guest
const getGuestPermissions = () => [
    PERMISSIONS.READ_POSTS,
    PERMISSIONS.READ_COMMENTS,
    PERMISSIONS.VIEW_PROFILES,
    PERMISSIONS.SEARCH_CONTENT,
];

// Helper function to get user permissions
const getUserPermissions = () => [
    ...getGuestPermissions(),
    PERMISSIONS.CREATE_POSTS,
    PERMISSIONS.EDIT_POSTS,
    PERMISSIONS.DELETE_POSTS,
    PERMISSIONS.CREATE_COMMENTS,
    PERMISSIONS.EDIT_COMMENTS,
    PERMISSIONS.DELETE_COMMENTS,
    PERMISSIONS.READ_MESSAGES,
    PERMISSIONS.SEND_MESSAGES,
    PERMISSIONS.DELETE_MESSAGES,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.READ_NOTIFICATIONS,
    PERMISSIONS.ADVANCED_SEARCH,
];

// Helper function to get moderator permissions
const getModeratorPermissions = () => [
    ...getUserPermissions(),
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_NOTIFICATIONS,
];

// Helper function to get admin permissions
const getAdminPermissions = () => [
    ...getModeratorPermissions(),
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_ANALYTICS,
];

// Role-based permission mappings
export const ROLE_PERMISSIONS = {
    [ROLES.GUEST]: getGuestPermissions(),
    [ROLES.USER]: getUserPermissions(),
    [ROLES.MODERATOR]: getModeratorPermissions(),
    [ROLES.ADMIN]: getAdminPermissions(),
    [ROLES.SUPER_ADMIN]: [
        ...getAdminPermissions(),
        PERMISSIONS.SYSTEM_ADMIN,
    ],
} as const;

/**
 * Check if a role has specific permission
 */
export const hasPermission = (role: string, permission: string): boolean => {
    const rolePerms = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
    return rolePerms?.includes(permission as any) || false;
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role: string): string[] => {
    const rolePerms = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
    return rolePerms ? [...rolePerms] : [];
};

/**
 * Check if user has required permissions
 */
export const checkUserPermissions = (
    user: { role?: string; permissions?: string[] },
    requiredPermissions: string[]
): boolean => {
    if (!user) return false;
    
    // Check explicit permissions first
    if (user.permissions) {
        return requiredPermissions.every(permission => 
            user.permissions!.includes(permission)
        );
    }
    
    // Fall back to role-based permissions
    if (user.role) {
        const rolePerms = getRolePermissions(user.role);
        return requiredPermissions.every(permission => 
            rolePerms.includes(permission)
        );
    }
    
    return false;
};

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export type Role = typeof ROLES[keyof typeof ROLES];
