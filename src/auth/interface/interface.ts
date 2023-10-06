import { SignUpType } from '@src/common/config/sign-up-type.config';

interface SMSData {
  type: string;
  contentType: string;
  countryCode: string;
  from: string;
  content: string;
  messages: [
    {
      to: string;
    },
  ];
}

interface SelectedDailyUsage {
  id: number;
  dailySentCount: number;
}

interface AxiosPostResult {
  status: boolean;
  error?: object;
}

interface Payload {
  userId?: number;
  lecturerId?: number;
}

interface KakaoUserProfile {
  id: number;
  connected_at: string;
  for_partner: {
    uuid: string;
  };
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
    has_phone_number: boolean;
    phone_number_needs_agreement: boolean;
    phone_number: string;
    is_kakaotalk_user: boolean;
  };
}

interface GetUserResponse {
  userId?: number;
  userEmail?: string;
}

interface CreateUserAuthData {
  authEmail: string;
  signUpType: string;
}

interface AuthInputData {
  userId: number;
  email: string;
  signUpType: SignUpType;
}

export {
  SMSData,
  SelectedDailyUsage,
  AxiosPostResult,
  Payload,
  KakaoUserProfile,
  GetUserResponse,
  CreateUserAuthData,
  AuthInputData,
};
