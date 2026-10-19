import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { StaffRole } from '../types/staffType';

interface StaffFiltersProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  status: number | undefined;
  onStatusChange: (val: number | undefined) => void;
  roleId: string | undefined;
  onRoleIdChange: (val: string | undefined) => void;
  roles: StaffRole[];
  onReset: () => void;
}

export const StaffFilters: React.FC<StaffFiltersProps> = ({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  roleId,
  onRoleIdChange,
  roles,
  onReset,
}) => {
  const hasActiveFilters = Boolean(keyword || status !== undefined || roleId);

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white border border-gray-200 rounded-xl p-3 shadow-2xs">
      {/* Keyword Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Tìm theo họ tên hoặc email nhân viên..."
          className="w-full rounded-lg bg-gray-50 border border-gray-200 pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-black transition-colors"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => onKeywordChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Role Select */}
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus-within:border-black">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
          <select
            value={roleId || ''}
            onChange={(e) => onRoleIdChange(e.target.value || undefined)}
            className="bg-transparent text-xs text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.code})
              </option>
            ))}
          </select>
        </div>

        {/* Status Select */}
        <select
          value={status === undefined ? '' : status}
          onChange={(e) =>
            onStatusChange(
              e.target.value === '' ? undefined : Number(e.target.value),
            )
          }
          className="bg-gray-50 border border-gray-200 text-xs text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-black cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Đang hoạt động (ACTIVE)</option>
          <option value="2">Đã khoá (LOCKED)</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Xoá bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};
