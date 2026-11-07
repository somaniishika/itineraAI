import axios from 'axios';
import type { LoginRequest, LoginResponse, OtpRequest, SignupRequest, VerifyOtpRequest } from '../types/auth';
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
