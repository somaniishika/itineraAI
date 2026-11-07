import axios from 'axios';
import type { LoginRequest, LoginResponse, OtpRequest, ProfileDetails, SignupRequest, UpdateProfileRequest, UpdateProfileResponse, VerifyOtpRequest } from '../types/auth';
import type { AdminQuestionnaire, AdminQuestionnaireRequest, AdminUserDetailsResponse, AdminUserListResponse, ApiAuditLogResponse, SuspensionRequestListResponse, UpdateAdminUserStatusRequest } from '../types/admin';
import type { CreateItineraryRequest, FeatureCreditsResponse, FeaturePriceResponse, ItineraryListResponse, ItineraryQuestion, ItineraryRecord } from '../types/itinerary';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseMessage = error.response?.data?.message || error.response?.data?.error;
    const message = Array.isArray(responseMessage)
      ? responseMessage.join(' ')
      : responseMessage || error.message || 'Something went wrong. Please try again.';

    const requestError = new Error(message) as Error & { status?: number };
    requestError.status = error.response?.status;
    return Promise.reject(requestError);
  },
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('itineraai_token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authApi = {
  signup: (payload: SignupRequest) => api.post('/auth/signup', payload),
  login: (payload: LoginRequest) => api.post<LoginResponse>('/auth/login', payload),
  sendOtp: (payload: OtpRequest) => api.post('/otp', payload),
  verifyOtp: (payload: VerifyOtpRequest) => api.post('/otp/_verify', payload),
  googleLogin: () => {
    window.location.href = `${baseURL}/auth/google`;
  },
};

export const userApi = {
  getProfile: () => api.get<{ success: boolean; message: string; data: ProfileDetails }>('/users'),
  updateProfile: (payload: UpdateProfileRequest) => api.put<UpdateProfileResponse>('/users', payload),
};

export const adminApi = {
  users: (params: { page: number; limit: number; name?: string; email?: string; username?: string; is_active?: boolean }) =>
    api.get<AdminUserListResponse>('/admin/users', { params }),
  userDetails: (id: number) => api.get<AdminUserDetailsResponse>(`/admin/users/${id}`),
  updateUserStatus: (status: 'suspend' | 'reactivate', payload: UpdateAdminUserStatusRequest) =>
    api.put<{ success: boolean; message: string }>('/admin/user-status', payload, { params: { status } }),
  questionnaire: () => api.get<AdminQuestionnaire[]>('/admin/questionnaire'),
  createQuestionnaire: (payload: AdminQuestionnaireRequest) => api.post<AdminQuestionnaire>('/admin/questionnaire', payload),
  updateQuestionnaire: (id: number, payload: Partial<AdminQuestionnaireRequest>) => api.put<AdminQuestionnaire>(`/admin/questionnaire/${id}`, payload),
  deleteQuestionnaire: (id: number) => api.delete<void>(`/admin/questionnaire/${id}`),
  suspensionRequests: (params: { page: number; limit: number; status?: 'PENDING' | 'APPROVED' }) =>
    api.get<SuspensionRequestListResponse>('/admin/suspension-requests', { params }),
  auditLogs: (params: { page: number; limit: number }) =>
    api.get<ApiAuditLogResponse>('/admin/api-audit-logs', { params }),
};

export const itineraryApi = {
  list: (page = 1, limit = 10) =>
    api.get<ItineraryListResponse>('/itinerary/list', { params: { page, limit } }),
  questions: () => api.get<ItineraryQuestion[]>('/itinerary/questions'),
  create: (payload: CreateItineraryRequest) => api.post<Record<string, unknown>>('/itinerary', payload),
  detail: (id: number) => api.get<ItineraryRecord>(`/itinerary/${id}`),
};

export const featureApi = {
  credits: () => api.get<FeatureCreditsResponse>('/feature-credits'),
  price: (featureType: string) => api.get<FeaturePriceResponse>('/feature-prices', { params: { type: featureType } }),
};
