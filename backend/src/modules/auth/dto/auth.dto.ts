export interface LoginDTO {
  email: string;
  password?: string;
}

export interface TokenRefreshDTO {
  refresh_token: string;
}
