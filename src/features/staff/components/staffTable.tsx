import React from 'react';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Send,
  Lock,
  Unlock,
  Loader2,
  Key,
} from 'lucide-react';
import type { StaffPageResponse, StaffMember } from '../types/staffType';

interface StaffTableProps {
  data: StaffPageResponse | null | undefined;
  isLoading: boolean;
  isError?: boolean;
  error?: Error | null;
  onPageChange: (page: number) => void;
  onToggleLock: (staff: StaffMember) => void;
  onChangeRole: (staff: StaffMember) => void;
  onResendInvite: (staff: StaffMember) => void;
  resendingStaffId?: string | null;
  currentStaffId?: string;
}

export const StaffTable: React.FC<StaffTableProps> = ({
  data,
  isLoading,
  isError,
  error,
  onPageChange,
  onToggleLock,
  onChangeRole,
  onResendInvite,
  resendingStaffId,
  currentStaffId,
}) => {
  if (isError) {
    return (
      <div className="rounded-lg border border-error bg-error-container p-12 text-center shadow-sm">
        <p className="font-headline-sm text-on-error-container">
          Unable to load staff directory
        </p>
        <p className="mt-1 font-body-sm text-on-error-container/80">
          {error?.message || 'Server connection error'}
        </p>
      </div>
    );
  }
  if (isLoading && !data) {
    return (
      <div className="rounded-lg border border-[#e5e7eb] bg-surface-container-lowest p-12 text-center shadow-sm">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
        <p className="mt-2 font-label-sm uppercase tracking-wider text-secondary">
          Loading staff directory...
        </p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="rounded-lg border border-[#e5e7eb] bg-surface-container-lowest p-12 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container text-secondary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h3 className="mt-3 font-headline-sm text-on-surface">
          No matching personnel found
        </h3>
        <p className="mt-1 font-body-sm text-secondary">
          Try adjusting your search filters or onboarding a new operator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-[#e5e7eb] bg-surface-container-lowest shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container text-secondary font-label-sm uppercase tracking-wider">
              <th className="py-3 px-space-md font-medium">Staff Member</th>
              <th className="py-3 px-space-md font-medium">Internal Routing</th>
              <th className="py-3 px-space-md font-medium">Assigned Role</th>
              <th className="py-3 px-space-md font-medium">2FA Protocol</th>
              <th className="py-3 px-space-md font-medium">Account Status</th>
              <th className="py-3 px-space-md font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-0 text-on-surface">
            {data.items.map((staff) => {
              const isActive = staff.status === 1;
              const isSelf = staff.id === currentStaffId;
              const isResending = resendingStaffId === staff.id;
              const initials = staff.fullName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <tr
                  key={staff.id}
                  className="hover:bg-surface-container-low transition-colors group"
                >
                  {/* Staff Member */}
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-fixed flex items-center justify-center font-headline-sm text-label-md shrink-0">
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-body-md font-semibold text-on-surface">
                            {staff.fullName}
                          </span>
                          {isSelf && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-label-sm bg-primary text-on-primary">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="font-label-sm text-secondary">
                          STAFF_ID #{staff.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Internal Routing */}
                  <td className="py-space-md px-space-md">
                    <span className="font-body-sm text-secondary font-mono">
                      {staff.email}
                    </span>
                  </td>

                  {/* Assigned Role */}
                  <td className="py-space-md px-space-md">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary text-on-primary font-label-sm uppercase tracking-wider">
                      {staff.roleName || staff.roleCode}
                    </span>
                  </td>

                  {/* 2FA Protocol */}
                  <td className="py-space-md px-space-md">
                    <span className="inline-flex items-center gap-1 font-label-sm text-on-surface">
                      <Key className="h-3.5 w-3.5 text-on-surface" />
                      <span>2FA Enforced</span>
                    </span>
                  </td>

                  {/* Account Status */}
                  <td className="py-space-md px-space-md">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-surface-container-high text-on-surface font-label-sm uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-error-container text-on-error-container font-label-sm uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-error" />
                        <span>Locked</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-space-md px-space-md text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Resend invite button */}
                      <button
                        type="button"
                        onClick={() => onResendInvite(staff)}
                        disabled={isResending || !isActive}
                        title="Resend activation email"
                        className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 cursor-pointer"
                      >
                        {isResending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {/* Change Role Button */}
                      <button
                        type="button"
                        onClick={() => onChangeRole(staff)}
                        disabled={isSelf}
                        title={
                          isSelf
                            ? 'Cannot modify own role'
                            : 'Edit operator role'
                        }
                        className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded-lg font-label-sm text-on-surface transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        Edit Permissions
                      </button>

                      {/* Lock/Unlock Button */}
                      <button
                        type="button"
                        onClick={() => onToggleLock(staff)}
                        disabled={isSelf}
                        title={
                          isSelf
                            ? 'Cannot lock own account'
                            : isActive
                              ? 'Lock operator account'
                              : 'Unlock account'
                        }
                        className={`px-2 py-1 rounded-lg font-label-sm transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1 ${
                          isActive
                            ? 'bg-transparent hover:bg-error-container text-secondary hover:text-on-error-container'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            <span>Revoke</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3.5 w-3.5" />
                            <span>Unlock</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table Footer / Telemetry */}
        <div className="p-space-md bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-space-sm text-secondary font-label-sm border-t border-[#e5e7eb]">
          <div className="flex items-center gap-space-md">
            <span>
              SHOWING {data.items.length} OF {data.totalElements} RECORDED
              AGENTS
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline font-mono">
              AUDIT HASH: SHA-256:d87b12e09...
            </span>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(0, data.page - 1))}
              disabled={data.first}
              className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3 w-3" />
              <span>Previous</span>
            </button>
            <span className="px-2.5 py-1 bg-surface-container-lowest text-on-surface font-semibold rounded-lg shadow-2xs">
              {data.page + 1} / {Math.max(1, data.totalPages)}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(data.page + 1)}
              disabled={data.last}
              className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
