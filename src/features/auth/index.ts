// Auth feature public API exports
export type {
    AuthResponse,
    AuthRequest,
    RegisterRequest,
    AuthCredentials,
    AuthResult,
    AuthSession,
    AuthUser,
    AuthToken,
    AuthEvent,
    AuthErrorType,
    AuthEventType,
    AuthProviderType,
    AuthStatus
} from './data/models/auth';

// Re-export Zod schemas for validation (will be updated to use core types)
export {
    AuthResponseSchema,
    AuthRequestSchema,
    RegisterRequestSchema,
    RefreshTokenResponseSchema
} from './data/models/authZod';
