import React from 'react';
import { Plus, ShieldCheck, Key, Lock } from 'lucide-react';

interface StaffHeaderProps {
  totalCount: number;
  activeCount: number;
  lockedCount: number;
  rolesCount: number;
  onOpenAddModal: () => void;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({
  totalCount,
  activeCount,
  lockedCount,
  rolesCount,
  onOpenAddModal,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Operational Specimen Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl pb-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs mb-1">
            <span className="font-label-sm text-secondary uppercase tracking-widest">
              ATELIER // SEC-OPS_MODULE
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary" />
            <span className="font-label-sm text-secondary">TIER_01 ROLES</span>
          </div>

          <h1 className="font-headline-lg text-on-surface tracking-tight uppercase">
            Staff Directory & Access Control
          </h1>
          <p className="font-body-sm text-secondary mt-1">
            Manage personnel identity, allocate system privileges, and monitor
            real-time operational security posture.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <div className="bg-surface-container px-space-md py-2 rounded-lg flex items-center gap-space-xs text-on-surface">
            <span className="font-label-sm text-secondary uppercase">
              Total Agents:
            </span>
            <span className="font-label-md text-on-surface font-semibold">
              {String(totalCount).padStart(2, '0')} RECORDED
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="h-[42px] px-space-lg bg-primary hover:bg-neutral-800 text-on-primary font-label-md uppercase tracking-wider flex items-center gap-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>+ Add New Staff</span>
          </button>
        </div>
      </div>

      {/* Live Dynamic Metric Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-space-lg">
        {/* Card 1: Active Personnel */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between border border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-secondary uppercase">
              Active Personnel
            </span>
            <ShieldCheck className="h-[18px] w-[18px] text-emerald-600" />
          </div>
          <div className="mt-space-md flex items-baseline justify-between">
            <span className="font-headline-md text-on-surface">
              {activeCount}
            </span>
            <span className="font-label-sm text-secondary">
              OF {totalCount} REGISTERED
            </span>
          </div>
        </div>

        {/* Card 2: Locked Accounts */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between border border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-secondary uppercase">
              Locked Accounts
            </span>
            <Lock className="h-[18px] w-[18px] text-error" />
          </div>
          <div className="mt-space-md flex items-baseline justify-between">
            <span className="font-headline-md text-on-surface">
              {lockedCount}
            </span>
            <span className="font-label-sm text-secondary uppercase">
              {lockedCount > 0 ? 'ACCESS REVOKED' : 'ALL CLEAR'}
            </span>
          </div>
        </div>

        {/* Card 3: Dynamic Role Partitioning */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between border border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-secondary uppercase">
              Role Partitioning
            </span>
            <Key className="h-[18px] w-[18px] text-secondary" />
          </div>
          <div className="mt-space-md flex items-baseline justify-between">
            <span className="font-headline-md text-on-surface">
              {rolesCount} {rolesCount === 1 ? 'Role' : 'Roles'}
            </span>
            <span className="font-label-sm text-secondary uppercase">
              SYSTEM TIERS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
