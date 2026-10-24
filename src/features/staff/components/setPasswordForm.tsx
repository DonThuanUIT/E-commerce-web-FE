import React, { useState, useMemo } from 'react';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { useSetStaffPassword } from '../hooks/useStaff';

interface SetPasswordFormProps {
  token: string;
}

export const SetPasswordForm: React.FC<SetPasswordFormProps> = ({ token }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const setPasswordMutation = useSetStaffPassword();

  // Password strength evaluation
  const strength = useMemo(() => {
    if (!password)
      return { score: 0, label: 'Not entered', color: 'bg-surface-container' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak password', color: 'bg-error' };
      case 2:
        return {
          score: 2,
          label: 'Fair password',
          color: 'bg-secondary',
        };
      case 3:
        return { score: 3, label: 'Good password', color: 'bg-primary' };
      case 4:
        return {
          score: 4,
          label: 'Strong & secure',
          color: 'bg-emerald-600',
        };
      default:
        return { score: 0, label: 'Incomplete', color: 'bg-surface-container' };
    }
  }, [password]);

  const hasLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const isMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!token) {
      setValidationError(
        'Activation token is missing. Please check the email link.',
      );
      return;
    }

    if (!hasLength) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    if (!hasLower || !hasUpper || !hasDigit) {
      setValidationError(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      );
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await setPasswordMutation.mutateAsync({
        token,
        newPassword: password,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to set password';
      setValidationError(message);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md rounded-lg bg-surface-container-lowest border border-[#e5e7eb] p-8 text-center shadow-lg animate-in fade-in duration-300">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 mb-5 shadow-2xs">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div className="font-label-sm tracking-widest text-emerald-700 uppercase mb-1">
          CREDENTIAL ACTIVATED
        </div>
        <h2 className="font-headline-sm text-on-surface uppercase">
          Password Set Successfully
        </h2>
        <p className="font-body-sm text-secondary mt-2.5 leading-relaxed">
          Your Atelier administrative operator account has been provisioned and
          activated successfully. You can now use these credentials to sign in.
        </p>
        <a
          href="/auth/login"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary hover:bg-neutral-800 py-3 text-xs font-label-md uppercase tracking-wider text-on-primary transition-all cursor-pointer shadow-sm"
        >
          Proceed to Admin Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-surface-container-lowest border border-[#e5e7eb] p-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#edeef0]">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-container border border-outline-variant text-on-surface shrink-0">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <div className="font-label-sm tracking-widest text-secondary uppercase">
            OPERATOR INITIAL ONBOARDING
          </div>
          <h2 className="font-headline-sm text-on-surface uppercase tracking-tight">
            Initial Credential Setup
          </h2>
          <p className="font-body-sm text-secondary">
            Activate your Atelier Security operator account
          </p>
        </div>
      </div>

      {(validationError || setPasswordMutation.isError) && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-error-container border border-error text-on-error-container text-xs font-label-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-error mt-0.5" />
          <span>
            {validationError ||
              (setPasswordMutation.error instanceof Error
                ? setPasswordMutation.error.message
                : 'An error occurred while validating the activation token')}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password Input */}
        <div>
          <label className="block font-label-sm text-on-surface mb-1.5 uppercase">
            New Password <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters (upper, lower, digit)"
              className="w-full rounded-lg bg-surface-container-lowest border border-[#e5e7eb] px-3.5 py-2 pr-10 font-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary transition-colors shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Real-time Password Strength Meter */}
        {password && (
          <div className="space-y-2 p-3 rounded-lg bg-surface-container-low border border-[#e5e7eb]">
            <div className="flex items-center justify-between font-label-sm">
              <span className="text-secondary">Strength:</span>
              <span className="text-on-surface font-bold">
                {strength.label}
              </span>
            </div>
            {/* 4 segments progress bar */}
            <div className="grid grid-cols-4 gap-1.5 h-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`rounded-full transition-all duration-300 ${
                    strength.score >= step
                      ? strength.color
                      : 'bg-surface-container-high'
                  }`}
                />
              ))}
            </div>
            {/* Criteria checklist */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-label-sm pt-1 text-secondary">
              <div className="flex items-center gap-1.5">
                <span
                  className={hasLength ? 'text-emerald-600' : 'text-secondary'}
                >
                  ✓
                </span>
                <span>At least 8 chars</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={
                    hasLower && hasUpper ? 'text-emerald-600' : 'text-secondary'
                  }
                >
                  ✓
                </span>
                <span>Upper & lowercase</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={hasDigit ? 'text-emerald-600' : 'text-secondary'}
                >
                  ✓
                </span>
                <span>Number (0-9)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={
                    confirmPassword && isMatch
                      ? 'text-emerald-600'
                      : 'text-secondary'
                  }
                >
                  ✓
                </span>
                <span>Passwords match</span>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Password Input */}
        <div>
          <label className="block font-label-sm text-on-surface mb-1.5 uppercase">
            Confirm Password <span className="text-error">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="w-full rounded-lg bg-surface-container-lowest border border-[#e5e7eb] px-3.5 py-2 font-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary transition-colors shadow-2xs"
          />
        </div>

        <button
          type="submit"
          disabled={setPasswordMutation.isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary hover:bg-neutral-800 py-3 text-xs font-label-md uppercase tracking-wider text-on-primary transition-all disabled:opacity-50 cursor-pointer shadow-sm mt-2"
        >
          {setPasswordMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          <span>Confirm & Activate Account</span>
        </button>
      </form>
    </div>
  );
};
