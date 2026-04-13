import { create } from 'zustand';
import { userApi } from '../apiClient/userApi';
import type { UserDTO, RegisterData } from '../apiClient/userApi';

interface UserStore {
  user: UserDTO | null;
  token: string | null;
  team: { id: string; name: string; type: string } | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserDTO>) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  token: localStorage.getItem('scout_token'),
  team: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await userApi.login(email, password);
      localStorage.setItem('scout_token', token);
      set({ token, user, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await userApi.register(data);
      localStorage.setItem('scout_token', token);
      set({ token, user, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('scout_token');
    set({ user: null, token: null, team: null });
  },

  loadProfile: async () => {
    if (!get().token) return;
    set({ isLoading: true, error: null });
    try {
      const user = await userApi.getProfile();
      set({ user, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userApi.updateProfile(data);
      set({ user, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
