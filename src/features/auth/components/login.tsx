import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Headphones } from 'lucide-react';
import { EditorialHero } from './editorialHero';

/**
 * Customer sign in screen matching the Atelier luxury editorial lookbook.
 */
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('elena.rostova@maison.vn');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white lg:flex-row">
      {/* Left Column: Dynamic Editorial Fashion Carousel */}
      <EditorialHero />

      {/* Right Column: Sign In Form */}
      <div className="flex w-full flex-1 flex-col justify-between overflow-y-auto px-6 py-8 sm:px-12 sm:py-10 md:px-16 lg:w-1/2 lg:px-16 xl:px-24">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
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
        <div className="mx-auto my-auto w-full max-w-md py-8">
          {/* Segmented Tab Switcher */}
          <div className="mb-8 grid grid-cols-2 rounded-xl bg-neutral-100 p-1 text-xs">
            <span className="rounded-lg bg-white py-2.5 text-center font-semibold text-neutral-900 shadow-sm transition">
              Sign In
            </span>
            <Link
              to="/auth/register"
              className="rounded-lg py-2.5 text-center font-medium text-neutral-500 transition hover:text-neutral-900"
            >
              Create Account
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
              Welcome Back
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 sm:text-sm">
              Access your bespoke orders, curated wishlist, and personal atelier
              concierge.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <label
                  htmlFor="login-email"
                  className="text-[11px] font-semibold tracking-wider text-neutral-700 uppercase"
                >
                  Email Address
                </label>
                <span className="text-[11px] text-neutral-400">Required</span>
              </div>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena.rostova@maison.vn"
                className="w-full rounded-lg border border-neutral-200 px-3.5 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <label
                  htmlFor="login-password"
                  className="text-[11px] font-semibold tracking-wider text-neutral-700 uppercase"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-neutral-200 px-3.5 py-3 pr-10 text-sm text-neutral-900 placeholder-neutral-400 transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 accent-black text-black focus:ring-black"
                />
                <span className="text-neutral-600">Remember this device</span>
              </label>
              <a
                href="#forgot"
                className="text-neutral-500 transition hover:text-neutral-900"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3.5 px-4 text-xs font-semibold tracking-widest text-white uppercase transition hover:bg-neutral-800 cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <span>SIGN IN</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <span className="relative bg-white px-3 text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
              Or Continue With
            </span>
          </div>

          {/* Social Login Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white py-3 px-4 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
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
              className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white py-3 px-4 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 cursor-pointer"
            >
              <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* Footer info & Concierge */}
        <div className="pt-6 text-center">
          <p className="text-[11px] leading-relaxed text-neutral-400">
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
          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
            <Headphones className="h-3.5 w-3.5" />
            <span>Concierge Assistance Available 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
