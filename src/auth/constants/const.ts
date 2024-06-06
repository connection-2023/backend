export const OAuthProvider = {
  KAKAO: 'KAKAO',
  GOOGLE: 'GOOGLE',
  NAVER: 'NAVER',
} as const;

export type OAuthProvider = (typeof OAuthProvider)[keyof typeof OAuthProvider];
