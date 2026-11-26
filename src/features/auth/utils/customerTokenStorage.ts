const ACCESS_TOKEN_KEY = 'customer_access_token';
const CUSTOMER_PROFILE_KEY = 'customer_profile';

export interface StoredCustomerProfile {
  id: string;
  email: string;
  fullName: string;
  status: string;
  createdAt: string;
}

function hasStorage(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

export const customerTokenStorage = {
  getAccessToken(): string | null {
    if (!hasStorage()) return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setSession(accessToken: string, customer?: StoredCustomerProfile): void {
    if (!hasStorage()) return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (customer) {
      window.localStorage.setItem(
        CUSTOMER_PROFILE_KEY,
        JSON.stringify(customer),
      );
    }
  },

  getCustomerProfile(): StoredCustomerProfile | null {
    if (!hasStorage()) return null;
    const raw = window.localStorage.getItem(CUSTOMER_PROFILE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredCustomerProfile;
    } catch {
      return null;
    }
  },

  clear(): void {
    if (!hasStorage()) return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(CUSTOMER_PROFILE_KEY);
  },
};
