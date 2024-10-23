import React from "react";

export interface LoginBody {
    email: string;
    password: string;
}

export interface SignupBody extends LoginBody {
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
    formData: LoginBody | SignupBody | ActivationData
}

export type SetAuthState = React.Dispatch<React.SetStateAction<AuthState>>;

export interface AuthFormProps {
    setAuthState: SetAuthState
    authState: AuthState
}

export interface SignupFormProps extends AuthFormProps { }

export interface ActivationFormProps extends AuthFormProps { }