export interface RefreshTokenSchema {
    id: string
    userId: string
    message: string
    accessToken: string
}

export interface AuthSchema extends RefreshTokenSchema {
    refreshToken: string
}

export interface AuthReuest {
    email: string
    password: string
}

export interface RegisterRequest extends AuthReuest {
    username: string
    firstname: string
    lastname: string
}