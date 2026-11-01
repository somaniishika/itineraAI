export type AuthPurpose = 'VERIFY_EMAIL' | 'PASSWORD_RESET';

export type UserProfile = {
  id: number;
  email?: string;
  username?: string;
  full_name?: string;
  role?: string;
};

export type LoginRequest = {
  emailOrUsername: string;
  password: string;
};

export type SignupRequest = {
  full_name: string;
  email: string;
  password: string;
  username?: string;
  address?: string;
};

export type OtpRequest = {
  email: string;
  purpose: AuthPurpose;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
  purpose: AuthPurpose;
  newPassword?: string;
};

export type ApiSuccessResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type LoginResponse = ApiSuccessResponse<{
  accessToken: string;
  user: UserProfile;
}>;
