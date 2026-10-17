/**
 * Registration request payload sent to the backend.
 */
export interface RegisterUserRequest {
  /** Customer email address. */
  email: string;
  /** Strong password with minimum 8 chars, 1 uppercase, 1 lowercase, 1 digit. */
  password: string;
  /** Customer full name. */
  fullName: string;
}

/**
 * Data returned upon successful customer registration.
 */
export interface RegisteredUser {
  id: string;
  email: string;
  fullName: string;
  status: string;
  createdAt: string;
}

/**
 * Form field values managed by the registration UI.
 */
export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

/**
 * Validation errors associated with registration form fields.
 */
export interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}
