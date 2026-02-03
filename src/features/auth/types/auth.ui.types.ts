import * as React from "react";
import { LoginBody, SignupBody, ActivationData } from "../../../shared/types/auth.dto";

export enum AuthPages {
    LOGIN = "LOGIN",
    SIGNUP = "SIGNUP",
    ACTIVATION = "ACTIVATION"
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