import { useState } from 'react';
import { ApiRequestError } from '../../../shared/api/apiRequestError';
import { authService } from '../services/authService';
import type {
  RegisterFormErrors,
  RegisterFormValues,
  RegisteredUser,
} from '../types/auth';
import { validateRegisterForm } from '../utils/validation';

const initialValues: RegisterFormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: true,
};

/**
 * Manages form state, client-side validation, and registration API interaction.
 */
export function useRegister() {
  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(
    null,
  );
  const [generalError, setGeneralError] = useState<string | null>(null);

  /**
   * Updates a single field value and clears its associated validation error.
   */
  const setFieldValue = (
    field: keyof RegisterFormValues,
    value: string | boolean,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  /**
   * Input change event handler.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFieldValue(name as keyof RegisterFormValues, fieldValue);
  };

  /**
   * Resets form back to initial state.
   */
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    setRegisteredUser(null);
    setGeneralError(null);
  };

  /**
   * Handles form submission, running client validation first before invoking the API.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-side validation
    const validationErrors = validateRegisterForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setGeneralError('Vui lòng kiểm tra và sửa các thông tin chưa chính xác.');
      return;
    }

    // 2. Call registration API
    setIsSubmitting(true);
    setGeneralError(null);
    setErrors({});

    try {
      const result = await authService.register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      setRegisteredUser(result);
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof ApiRequestError) {
        const serverErrors: RegisterFormErrors = {};
        if (err.fieldErrors && err.fieldErrors.length > 0) {
          for (const fe of err.fieldErrors) {
            if (fe.field === 'email') serverErrors.email = fe.message;
            else if (fe.field === 'password')
              serverErrors.password = fe.message;
            else if (fe.field === 'fullName' || fe.field === 'full_name')
              serverErrors.fullName = fe.message;
          }
        }

        // Map duplicate email status or code
        if (
          err.status === 409 ||
          err.code === 'EMAIL_ALREADY_REGISTERED' ||
          err.message.toLowerCase().includes('email')
        ) {
          serverErrors.email =
            'Email này đã tồn tại trong hệ thống. Vui lòng đăng nhập hoặc sử dụng email khác.';
        }

        setErrors(serverErrors);
        setGeneralError(
          err.message ||
            'Đăng ký tài khoản không thành công. Vui lòng thử lại.',
        );
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    isSuccess,
    registeredUser,
    generalError,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
  };
}
