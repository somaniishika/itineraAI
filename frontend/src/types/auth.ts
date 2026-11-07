export type AuthPurpose = 'VERIFY_EMAIL' | 'PASSWORD_RESET';

export type UserProfile = {
  id: number;
  email?: string;
  username?: string;
  full_name?: string;
  role?: string;
};

export type ProfileDetails = {
  id: number;
  full_name: string;
  username: string | null;
  email: string;
  address: string | null;
  role: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type UpdateProfileRequest = {
  full_name: string;
  username: string;
  address: string;
};

export type UpdateProfileResponse = {
  success: boolean;
  message: string;
  data: Pick<ProfileDetails, 'id' | 'full_name' | 'username' | 'address'>;
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
