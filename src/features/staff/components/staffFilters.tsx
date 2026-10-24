import React, { useState, useEffect } from 'react';
import { Search, X, ShieldAlert } from 'lucide-react';
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
  const [localKeyword, setLocalKeyword] = useState(keyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      onKeywordChange(localKeyword);
    }, 400);
    return () => clearTimeout(timer);
  }, [localKeyword, onKeywordChange]);

  const hasActiveFilters = Boolean(keyword || status !== undefined || roleId);

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface-container-lowest p-space-md shadow-sm border border-[#e5e7eb]">
      {/* Top filter row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Debounced Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <input
            type="text"
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            placeholder="Search by name, email, or STAFF_ID..."
            className="w-full rounded-lg bg-surface-container-lowest border border-[#e5e7eb] pl-10 pr-9 py-2 text-xs font-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
          />
          {localKeyword && (
            <button
              type="button"
              onClick={() => {
                setLocalKeyword('');
                onKeywordChange('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown & Policy Pill */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={status === undefined ? '' : status}
            onChange={(e) =>
              onStatusChange(
                e.target.value === '' ? undefined : Number(e.target.value),
              )
            }
            className="bg-surface-container-lowest border border-[#e5e7eb] text-xs font-body-sm text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="1">Active (ACTIVE)</option>
            <option value="2">Locked (LOCKED)</option>
          </select>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-secondary text-[11px] font-label-sm">
            <ShieldAlert className="h-3.5 w-3.5 text-secondary" />
            <span>POLICY: STRICT_PKI</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setLocalKeyword('');
                onReset();
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-label-sm text-secondary hover:text-on-surface transition-colors cursor-pointer rounded-lg bg-surface-container"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Quick Role Filter Pills matching Stitch Screen 9 */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#edeef0]">
        <span className="font-label-sm text-secondary uppercase mr-1">
          Filter Directory:
        </span>
        <button
          type="button"
          onClick={() => onRoleIdChange(undefined)}
          className={`px-2.5 py-1 rounded-lg font-label-sm uppercase transition-colors cursor-pointer ${
            roleId === undefined
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-secondary hover:text-on-surface'
          }`}
        >
          ALL
        </button>

        {roles.map((r) => {
          const isSelected = roleId === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onRoleIdChange(isSelected ? undefined : r.id)}
              className={`px-2.5 py-1 rounded-lg font-label-sm uppercase transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-secondary hover:text-on-surface'
              }`}
            >
              {r.code}
            </button>
          );
        })}
      </div>
    </div>
  );
};
