import React from "react";

export interface LoginData {
    email: string;
    password: string;
}

export interface SignupData extends LoginData {
    username: string
    firstname: string
    lastname: string
    confirmPassword: string
}

export interface ActivationData {
    email: string
}

export enum AuthPages {
    LOGIN,
    SIGNNUP,
    ACTIVATION
}

export interface AuthState {
    page: AuthPages
    formData: LoginData | SignupData | ActivationData
}

export type SetAuthState = React.Dispatch<React.SetStateAction<AuthState>>;

export interface AuthFormProps {
    setAuthState: SetAuthState
    authState: AuthState
}

export interface SignupFormProps extends AuthFormProps { }

export interface ActivationFormProps extends AuthFormProps { }