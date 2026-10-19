import React from 'react';
import { Plus, Users, ShieldCheck, UserX } from 'lucide-react';

interface StaffHeaderProps {
  totalCount: number;
  activeCount: number;
  lockedCount: number;
  onOpenAddModal: () => void;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({
  totalCount,
  activeCount,
  lockedCount,
  onOpenAddModal,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-gray-700 uppercase mb-1">
          <span>ATELIER // SEC-OPS_MODULE</span>
          <span className="text-gray-700 font-bold">•</span>
          <span className="text-gray-700 font-semibold">TIER_01 ROLES</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-xs">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 font-serif uppercase">
              QUẢN LÝ NHÂN VIÊN & PHÂN QUYỀN
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Quản lý danh sách nhân sự nội bộ, cấp quyền truy cập và bảo mật
              tài khoản quản trị
            </p>
          </div>
        </div>

        {/* Quick status pill counters */}
        <div className="flex items-center gap-3 mt-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 shadow-2xs text-gray-700">
            <span className="font-semibold text-gray-900">{totalCount}</span>{' '}
            nhân sự
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>{activeCount} đang hoạt động</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium">
            <UserX className="h-3.5 w-3.5 text-amber-600" />
            <span>{lockedCount} đã khoá</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenAddModal}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold tracking-wider text-white uppercase shadow-sm hover:bg-neutral-800 transition-colors cursor-pointer active:scale-[0.99]"
      >
        <Plus className="h-4 w-4" />+ Thêm Nhân Viên
      </button>
    </div>
  );
};
