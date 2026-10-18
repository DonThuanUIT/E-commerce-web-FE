import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Headphones,
} from 'lucide-react';
import { useRegister } from '../hooks/useRegister';
import { EditorialHero } from './editorialHero';

/**
 * Customer registration screen designed following the Atelier luxury editorial lookbook.
 */
const Register: React.FC = () => {
  const {
    values,
    errors,
    isSubmitting,
    isSuccess,
    generalError,
    handleChange,
    handleSubmit,
    resetForm,
  } = useRegister();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  return (
    <div className="flex h-screen max-h-screen w-full flex-col overflow-hidden bg-white lg:flex-row">
      {/* Left Column: Dynamic Editorial Fashion Carousel */}
      <EditorialHero />

      {/* Right Column: Authentication & Registration Form */}
      <div className="flex h-full w-full flex-1 flex-col justify-between overflow-y-auto px-6 py-4 sm:px-10 sm:py-5 md:px-12 lg:w-1/2 lg:px-10 xl:px-14">
        {/* Top Header Navigation */}
        <div className="flex shrink-0 items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-xs font-medium tracking-wider text-neutral-600 transition hover:text-black uppercase"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
            <span>Return to Atelier</span>
          </Link>
          <span className="text-[11px] font-medium tracking-widest text-neutral-400 uppercase">
            Client Portal
          </span>
        </div>

        {/* Form Container */}
        <div className="mx-auto my-auto w-full max-w-sm xl:max-w-md py-1">
          {/* Segmented Tab Switcher */}
          <div className="mb-2.5 sm:mb-3 grid grid-cols-2 rounded-xl bg-neutral-100 p-1 text-xs">
            <Link
              to="/auth/login"
              className="rounded-lg py-1.5 text-center font-medium text-neutral-500 transition hover:text-neutral-900"
            >
              Sign In
            </Link>
            <span className="rounded-lg bg-white py-1.5 text-center font-semibold text-neutral-900 shadow-sm transition">
              Create Account
            </span>
          </div>

          {isSuccess ? (
            /* Success Confirmation State */
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 text-neutral-900 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-emerald-900">
                    Đăng ký tài khoản thành công!
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Hệ thống đã ghi nhận thông tin tài khoản của bạn.
                  </p>
                </div>
              </div>

              <div className="space-y-2 rounded-lg bg-white/80 p-4 text-xs leading-relaxed text-neutral-700 border border-emerald-100">
                <p>
                  Chúng tôi đã gửi email xác thực đến địa chỉ:
                  <strong className="block font-semibold text-neutral-900 mt-1">
                    {values.email}
                  </strong>
                </p>
                <p className="text-neutral-500">
                  Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Spam) và nhấp vào
                  liên kết xác nhận để kích hoạt tài khoản của bạn trước khi
                  đăng nhập.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  to="/auth/login"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3.5 px-4 text-xs font-semibold tracking-widest text-white uppercase transition hover:bg-neutral-800"
                >
                  <span>Đến trang Đăng nhập</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-2 text-center text-xs text-neutral-500 underline underline-offset-4 transition hover:text-neutral-900 cursor-pointer"
                >
                  Đăng ký tài khoản khác
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div>
              <div className="mb-2 sm:mb-2.5">
                <h1 className="text-2xl font-normal tracking-tight text-neutral-900 sm:text-3xl">
                  Create Account
                </h1>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Join Atelier to access bespoke orders, curated wishlist, and
                  personal atelier concierge.
                </p>
              </div>

              {/* General Error Banner */}
              {generalError && (
                <div className="mb-2 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                  <span className="leading-tight">{generalError}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-2 sm:space-y-2.5"
                noValidate
              >
                {/* Full Name */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <label
                      htmlFor="fullName"
                      className="text-[11px] font-semibold tracking-wider text-neutral-700 uppercase"
                    >
                      Họ và tên
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      Required
                    </span>
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={values.fullName}
                    onChange={handleChange}
                    placeholder="Elena Rostova"
                    autoComplete="name"
                    disabled={isSubmitting}
                    className={`w-full rounded-lg border px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 transition focus:outline-none ${
                      errors.fullName
                        ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-neutral-200 focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <label
                      htmlFor="email"
                      className="text-[11px] font-semibold tracking-wider text-neutral-700 uppercase"
                    >
                      Địa chỉ Email
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      Required
                    </span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="elena.rostova@maison.vn"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className={`w-full rounded-lg border px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 transition focus:outline-none ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-neutral-200 focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <label
                      htmlFor="password"
                      className="text-[11px] font-semibold tracking-wider text-neutral-700 uppercase"
                    >
                      Mật khẩu
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      Min 8 chars, 1 uppercase, 1 digit
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      className={`w-full rounded-lg border px-3 py-2 pr-9 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 transition focus:outline-none ${
                        errors.password
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-neutral-200 focus:border-black focus:ring-1 focus:ring-black'
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <label
                      htmlFor="confirmPassword"
                      className="text-[11px] font-semibold tracking-wider text-neutral-700 uppercase"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      Required
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      className={`w-full rounded-lg border px-3 py-2 pr-9 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 transition focus:outline-none ${
                        errors.confirmPassword
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-neutral-200 focus:border-black focus:ring-1 focus:ring-black'
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirm password'
                          : 'Show confirm password'
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms agreement */}
                <div className="pt-0.5">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={values.acceptTerms}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-neutral-300 accent-black text-black focus:ring-black"
                    />
                    <span className="text-[11px] text-neutral-600 leading-tight">
                      Tôi đồng ý nhận thông báo về bộ sưu tập và dịch vụ bespoke
                      từ Atelier.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 sm:py-3 px-4 text-xs font-semibold tracking-widest text-white uppercase transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400 cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>ĐANG KHỞI TẠO TÀI KHOẢN...</span>
                    </>
                  ) : (
                    <>
                      <span>CREATE ACCOUNT</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-2 sm:my-2.5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <span className="relative bg-white px-2.5 text-[9px] sm:text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                  Or Continue With
                </span>
              </div>

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 cursor-pointer"
                >
                  <svg
                    className="h-3.5 w-3.5 fill-[#1877F2]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & Concierge */}
        <div className="pt-2 shrink-0 text-center">
          <p className="text-[10px] sm:text-[11px] leading-relaxed text-neutral-400">
            By continuing, you agree to ATELIER's{' '}
            <a
              href="#terms"
              className="underline underline-offset-2 transition hover:text-neutral-700"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="#privacy"
              className="underline underline-offset-2 transition hover:text-neutral-700"
            >
              Privacy Policy
            </a>
            .
          </p>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
            <Headphones className="h-3 w-3" />
            <span>Concierge Assistance Available 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
