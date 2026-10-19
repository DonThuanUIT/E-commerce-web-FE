import React, { useState } from 'react';
import { X, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import type { StaffMember, StaffRole } from '../types/staffType';

interface ChangeRoleModalProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (staffId: string, newRoleId: string) => Promise<void>;
  roles: StaffRole[];
  isLoading: boolean;
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  staff,
  isOpen,
  onClose,
  onSubmit,
  roles,
  isLoading,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    staff?.roleId || '',
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !staff) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedRoleId) {
      setError('Vui lòng chọn vai trò mới');
      return;
    }
    if (selectedRoleId === staff.roleId) {
      onClose();
      return;
    }
    try {
      await onSubmit(staff.id, selectedRoleId);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể cập nhật vai trò',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-serif uppercase">
                Thay Đổi Vai Trò
              </h2>
              <p className="text-xs text-gray-500">
                {staff.fullName} ({staff.email})
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
              Chọn Vai Trò Mới
            </label>
            <select
              value={selectedRoleId || staff.roleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
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
              Cập Nhật Vai Trò
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
