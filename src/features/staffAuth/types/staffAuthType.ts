export interface StaffRoleInfo {
  id: string;
  code: string;
  name: string;
}

export interface StaffProfile {
  id: string;
  email: string;
  fullName: string;
  status: 'ACTIVE' | 'LOCKED';
  role: StaffRoleInfo;
  permissions: string[];
}

export interface StaffLoginRequest {
  email: string;
  password: string;
}

export interface StaffAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  staff: StaffProfile;
}

export interface StaffRefreshRequest {
  refreshToken: string;
}

export interface StaffLogoutRequest {
  refreshToken?: string;
}

export interface StaffAuthState {
  staff: StaffProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permissionCode: string) => boolean;
  hasAnyPermission: (permissionCodes: string[]) => boolean;
  login: (credentials: StaffLoginRequest) => Promise<StaffAuthResponse>;
  logout: () => Promise<void>;
  initialize: () => void;
}
