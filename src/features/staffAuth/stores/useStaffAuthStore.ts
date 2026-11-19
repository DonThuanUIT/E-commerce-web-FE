import { create } from 'zustand';
import type {
  StaffAuthState,
  StaffLoginRequest,
  StaffAuthResponse,
} from '../types/staffAuthType.ts';
import { staffAuthService } from '../services/staffAuthService.ts';
import {
  clearStaffAuthTokens,
  getStaffAccessToken,
  getStaffProfile,
  getStaffRefreshToken,
  setStaffAccessToken,
  setStaffProfile,
  setStaffRefreshToken,
} from '../utils/staffTokenStorage.ts';

export const useStaffAuthStore = create<StaffAuthState>((set, get) => ({
  staff: getStaffProfile(),
  isAuthenticated: Boolean(getStaffAccessToken() && getStaffProfile()),
  isLoading: false,

  hasPermission: (permissionCode: string) => {
    const { staff } = get();
    if (!staff || !Array.isArray(staff.permissions)) return false;
    return staff.permissions.includes(permissionCode);
  },

  hasAnyPermission: (permissionCodes: string[]) => {
    const { staff } = get();
    if (!staff || !Array.isArray(staff.permissions)) return false;
    return permissionCodes.some((code) => staff.permissions.includes(code));
  },

  login: async (credentials: StaffLoginRequest): Promise<StaffAuthResponse> => {
    set({ isLoading: true });
    try {
      const response = await staffAuthService.login(credentials);
      setStaffAccessToken(response.accessToken);
      setStaffRefreshToken(response.refreshToken);
      setStaffProfile(response.staff);

      set({
        staff: response.staff,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const refreshToken = getStaffRefreshToken();
      if (refreshToken) {
        await staffAuthService.logout(refreshToken).catch(() => {
          // Ignore network or server error on logout
        });
      }
    } finally {
      clearStaffAuthTokens();
      set({
        staff: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  initialize: () => {
    const token = getStaffAccessToken();
    const profile = getStaffProfile();
    if (token && profile) {
      set({
        staff: profile,
        isAuthenticated: true,
      });
    } else {
      clearStaffAuthTokens();
      set({
        staff: null,
        isAuthenticated: false,
      });
    }
  },
}));
