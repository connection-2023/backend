export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface UserTokenPayload {
  userId: number;
  iat: number;
  exp: number;
}

export interface LecturerTokenPayload {
  lecturerId: number;
  iat: number;
  exp: number;
}
