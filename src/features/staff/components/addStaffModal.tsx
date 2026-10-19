import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import type { CreateStaffCommand, StaffRole } from '../types/staffType';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStaffCommand) => Promise<void>;
  roles: StaffRole[];
  isLoading: boolean;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roles,
  isLoading,
}) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [roleId, setRoleId] = useState(roles[0]?.id || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    if (!fullName.trim()) {
      setError('Họ và tên không được để trống');
      return;
    }
    const selectedRole = roleId || roles[0]?.id;
    if (!selectedRole) {
      setError('Vui lòng chọn vai trò nhân viên');
      return;
    }

    try {
      await onSubmit({
        email: email.trim(),
        fullName: fullName.trim(),
        roleId: selectedRole,
      });
      setEmail('');
      setFullName('');
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo nhân viên',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase">
                Thêm Nhân Viên Mới
              </h2>
              <p className="text-xs text-gray-500">
                Hệ thống sẽ gửi email mời kích hoạt tài khoản
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Họ và Tên <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Email Doanh Nghiệp <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@atelier.vn"
              className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Vai Trò Hệ Thống <span className="text-rose-500">*</span>
            </label>
            <select
              value={roleId || roles[0]?.id || ''}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold tracking-wider text-white uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Tạo & Gửi Thư Mời
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
