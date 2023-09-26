export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: number;
  iat: number;
  exp: number;
}
