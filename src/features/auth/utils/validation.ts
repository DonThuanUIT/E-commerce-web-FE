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
    errors.fullName = 'Họ và tên không được để trống';
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
  }

  // 2. Email validation
  if (!values.email || !values.email.trim()) {
    errors.email = 'Email không được để trống';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Email không đúng định dạng (VD: example@domain.com)';
  }

  // 3. Password validation
  if (!values.password) {
    errors.password = 'Mật khẩu không được để trống';
  } else if (values.password.length < 8) {
    errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
  } else if (!PASSWORD_REGEX.test(values.password)) {
    errors.password =
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số';
  }

  // 4. Confirm password validation
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }

  return errors;
}
