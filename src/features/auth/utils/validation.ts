import type { RegisterFormErrors, RegisterFormValues } from '../types/auth';

/**
 * Email format matching standard addresses with valid domain extensions.
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

/**
 * Password policy requiring at least 1 uppercase, 1 lowercase, and 1 numeric digit.
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

/**
 * Validates registration form values on the client side.
 *
 * @param values - Current form input values
 * @returns Object containing field-level error messages, if any
 */
export function validateRegisterForm(
  values: RegisterFormValues,
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  // 1. Full name validation
  if (!values.fullName || !values.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters long';
  }

  // 2. Email validation
  if (!values.email || !values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Invalid email format (e.g., example@domain.com)';
  }

  // 3. Password validation
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  } else if (!PASSWORD_REGEX.test(values.password)) {
    errors.password =
      'Password must contain at least 1 uppercase, 1 lowercase, and 1 numeric digit';
  }

  // 4. Confirm password validation
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}
