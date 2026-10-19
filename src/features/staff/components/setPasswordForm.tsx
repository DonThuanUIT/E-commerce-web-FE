import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useSetStaffPassword } from '../hooks/useStaff';

interface SetPasswordFormProps {
  token: string;
}

export const SetPasswordForm: React.FC<SetPasswordFormProps> = ({ token }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const setPasswordMutation = useSetStaffPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password.length < 8) {
      setValidationError('Mật khẩu phải có tối thiểu 8 ký tự');
      return;
    }
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);

    if (!hasLower || !hasUpper || !hasDigit) {
      setValidationError(
        'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một chữ số',
      );
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Xác nhận mật khẩu không khớp');
      return;
    }

    try {
      await setPasswordMutation.mutateAsync({
        token,
        newPassword: password,
      });
      setIsSuccess(true);
    } catch {
      // Error handled by mutation state
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 p-8 text-center shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 uppercase">
          Thiết Lập Mật Khẩu Thành Công
        </h2>
        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
          Tài khoản quản trị của bạn đã được kích hoạt thành công. Bạn có thể
          đăng nhập vào cổng quản trị với mật khẩu mới.
        </p>
        <a
          href="/auth/login"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-black py-3 text-xs font-semibold tracking-wider text-white uppercase hover:bg-neutral-800 transition-colors shadow-xs"
        >
          Đi Đến Đăng Nhập
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xs">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 uppercase">
            Thiết Lập Mật Khẩu Ban Đầu
          </h2>
          <p className="text-xs text-gray-500">
            Kích hoạt tài khoản nhân viên quản trị Atelier
          </p>
        </div>
      </div>

      {(validationError || setPasswordMutation.isError) && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {validationError ||
              (setPasswordMutation.error instanceof Error
                ? setPasswordMutation.error.message
                : 'Đã có lỗi xảy ra')}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Mật Khẩu Mới <span className="text-rose-500">*</span>
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tối thiểu 8 ký tự (hoa, thường, số)"
            className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Xác Nhận Mật Khẩu <span className="text-rose-500">*</span>
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-black"
          />
        </div>

        <button
          type="submit"
          disabled={setPasswordMutation.isPending}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-black py-3 text-xs font-semibold tracking-wider text-white uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {setPasswordMutation.isPending && (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          )}
          Xác Nhận & Kích Hoạt Tài Khoản
        </button>
      </form>
    </div>
  );
};
