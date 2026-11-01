import axios from 'axios';
import type { LoginRequest, LoginResponse, OtpRequest, SignupRequest, VerifyOtpRequest } from '../types/auth';

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
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.';

    return Promise.reject(new Error(message));
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
