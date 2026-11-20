import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useStaffAuthStore } from '../stores/useStaffAuthStore.ts';

export const StaffLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin/staff';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = useStaffAuthStore((state) => state.login);
  const isLoading = useStaffAuthStore((state) => state.isLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your work email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      await login({ email: trimmedEmail, password });
      navigate(redirectUrl, { replace: true });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMessage(
        errorObj.message || 'Invalid credentials or account access restricted.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-4">
      {/* Brand logo top mark matching StaffSetPasswordPage & Atelier design standards */}
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary font-headline-sm text-sm tracking-widest shadow-sm">
          A
        </div>
        <div className="text-left">
          <span className="font-headline-sm text-on-surface uppercase block leading-tight">
            ATELIER
          </span>
          <span className="font-label-sm text-secondary uppercase block">
            CORE // SEC-OPS
          </span>
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* Card Form */}
        <div className="rounded-xl bg-surface-container-lowest border border-[#e5e7eb] p-6 sm:p-8 shadow-xl">
          {/* Header inside Card */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-container border border-outline-variant text-[11px] font-label-sm text-secondary uppercase tracking-wider mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Strict PKI Enforced</span>
            </div>
            <h1 className="font-headline-md text-on-surface uppercase">
              Atelier Console
            </h1>
            <p className="font-body-sm text-secondary mt-1">
              Sign in with authorized enterprise credentials to access
              administrative operations.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-error-container border border-error text-on-error-container text-xs font-label-sm">
              <AlertCircle className="h-4 w-4 shrink-0 text-error mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="staff-email"
                className="block font-label-sm text-on-surface mb-1.5 uppercase"
              >
                Work Email <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="staff-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@atelier.local"
                  className="w-full rounded-lg bg-surface-container-lowest border border-[#e5e7eb] pl-10 pr-4 py-2.5 font-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors shadow-2xs disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="staff-password"
                className="block font-label-sm text-on-surface mb-1.5 uppercase"
              >
                Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="staff-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg bg-surface-container-lowest border border-[#e5e7eb] pl-10 pr-11 py-2.5 font-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors shadow-2xs disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-on-surface transition cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-primary hover:bg-neutral-800 active:bg-black text-on-primary font-label-md uppercase tracking-wider rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Console</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#edeef0] flex items-center justify-between text-xs font-label-sm text-secondary">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-on-surface transition uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>
            <span>SEC_OPS // TIER_01</span>
          </div>
        </div>

        {/* Security Notice Footer */}
        <p className="mt-6 text-center text-[11px] text-secondary font-label-sm uppercase tracking-wider">
          Authorized personnel only. All access attempts and actions are logged.
        </p>
      </div>
    </div>
  );
};
