import React, { useState } from 'react';
import { Lock, Unlock, AlertTriangle, Loader2 } from 'lucide-react';
import type { StaffMember } from '../types/staffType';

interface LockStaffModalProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmLock: (staffId: string) => Promise<void>;
  onConfirmUnlock: (staffId: string) => Promise<void>;
  isLoading: boolean;
}

export const LockStaffModal: React.FC<LockStaffModalProps> = ({
  staff,
  isOpen,
  onClose,
  onConfirmLock,
  onConfirmUnlock,
  isLoading,
}) => {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !staff) return null;

  const isLocking = staff.status === 1;

  const handleAction = async () => {
    setError(null);
    try {
      if (isLocking) {
        await onConfirmLock(staff.id);
      } else {
        await onConfirmUnlock(staff.id);
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Thao tác không thành công',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              isLocking
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {isLocking ? (
              <Lock className="h-5 w-5" />
            ) : (
              <Unlock className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 font-serif uppercase">
              {isLocking
                ? 'Xác nhận khoá tài khoản'
                : 'Xác nhận mở khoá tài khoản'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Nhân viên:{' '}
              <span className="font-semibold text-gray-900">
                {staff.fullName}
              </span>{' '}
              ({staff.email})
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3.5 border border-gray-200 text-xs text-gray-600 leading-relaxed">
          {isLocking ? (
            <div className="flex items-start gap-2 text-rose-800">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>
                Khoá tài khoản sẽ lập tức thu hồi mọi phiên làm việc của nhân
                viên này. Họ sẽ không thể truy cập bất kỳ khu vực quản trị nào
                cho đến khi được mở khoá.
              </span>
            </div>
          ) : (
            <span>
              Mở khoá tài khoản sẽ cho phép nhân viên này đăng nhập lại vào hệ
              thống quản trị với đầy đủ quyền hạn của vai trò hiện tại.
            </span>
          )}
        </div>

        {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}

        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Huỷ bỏ
          </button>
          <button
            type="button"
            onClick={handleAction}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold tracking-wider uppercase text-white transition-colors disabled:opacity-50 cursor-pointer shadow-xs ${
              isLocking
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isLocking ? 'Khoá Tài Khoản' : 'Mở Khoá Tài Khoản'}
          </button>
        </div>
      </div>
    </div>
  );
};
