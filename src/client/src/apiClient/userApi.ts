import { http } from './httpClient';

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
  areasOfInterest: string[];
  totalSteps: number;
  totalXP: number;
  badges: string[];
  teamId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
  role: string;
  areasOfInterest?: string[];
}

export const userApi = {
  register: (data: RegisterData) => http.post<AuthResponse>('/api/auth/register', data),
  login: (email: string, password: string) =>
    http.post<AuthResponse>('/api/auth/login', { email, password }),
  getProfile: () => http.get<UserDTO>('/api/profile'),
  updateProfile: (data: Partial<UserDTO>) => http.put<UserDTO>('/api/profile', data),
};
