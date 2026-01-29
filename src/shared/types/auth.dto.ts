/**
 * Shared authentication types
 * 
 * Basic authentication types used across the application.
 * These types are shared between different layers and features.
 */

export interface LoginBody {
    email: string;
    password: string;
}

export interface SignupBody extends LoginBody {
    username: string;
    firstname: string;
    lastname: string;
    confirmPassword: string;
}

export interface ActivationData {
    email: string;
}
