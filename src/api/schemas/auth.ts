export interface RefreshTokenResponse {
    id: string
    userId: string
    message: string
    token: string
}

export interface AuthResponse extends RefreshTokenResponse {
    refreshToken: string
}