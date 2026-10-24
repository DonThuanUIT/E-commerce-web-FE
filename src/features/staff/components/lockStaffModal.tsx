import React, { useState } from 'react';
import { X, Lock, Unlock, AlertTriangle, Loader2 } from 'lucide-react';
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

  const isActive = staff.status === 1;

  const handleConfirm = async () => {
    setError(null);
    try {
      if (isActive) {
        await onConfirmLock(staff.id);
      } else {
        await onConfirmUnlock(staff.id);
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update account status',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-lg bg-surface-container-lowest border border-[#e5e7eb] p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#edeef0]">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                isActive
                  ? 'bg-error-container text-error'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {isActive ? (
                <Lock className="h-5 w-5" />
              ) : (
                <Unlock className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface uppercase">
                {isActive ? 'Lock Operator Account' : 'Unlock Operator Account'}
              </h2>
              <p className="font-body-sm text-secondary font-mono">
                {staff.fullName} ({staff.email})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-error-container border border-error text-on-error-container text-xs font-label-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 text-error" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 space-y-3">
          <p className="font-body-sm text-on-surface leading-relaxed">
            {isActive ? (
              <>
                Are you sure you want to{' '}
                <strong className="text-error font-semibold">
                  revoke access
                </strong>{' '}
                for this operator? All active sessions and privileges will be
                terminated immediately.
              </>
            ) : (
              <>
                Are you sure you want to{' '}
                <strong className="text-emerald-700 font-semibold">
                  restore access
                </strong>{' '}
                for this operator? The operator will be permitted to
                authenticate and resume duties.
              </>
            )}
          </p>

          <div className="p-3 rounded-lg bg-surface-container-low border border-[#e5e7eb] font-body-sm text-secondary space-y-1">
            <div>
              • Role:{' '}
              <span className="text-on-surface font-medium">
                {staff.roleName || staff.roleCode}
              </span>
            </div>
            <div>
              • Current Status:{' '}
              <span
                className={
                  isActive
                    ? 'text-emerald-700 font-semibold'
                    : 'text-error font-semibold'
                }
              >
                {isActive ? 'ACTIVE' : 'LOCKED'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-5 mt-4 border-t border-[#edeef0]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 font-label-md text-secondary hover:text-on-surface transition-colors cursor-pointer uppercase"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 font-label-md tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer shadow-sm ${
              isActive
                ? 'bg-error hover:bg-red-700 text-on-error'
                : 'bg-primary hover:bg-neutral-800 text-on-primary'
            }`}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isActive ? 'Confirm Lock' : 'Confirm Unlock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
