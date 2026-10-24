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
      setError('Please select a new role');
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
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-lg bg-surface-container-lowest border border-[#e5e7eb] p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#edeef0]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container border border-outline-variant text-on-surface">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-headline-sm text-on-surface uppercase">
                Update Security Role
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
            <AlertCircle className="h-4 w-4 shrink-0 text-error" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block font-label-sm text-on-surface mb-1.5 uppercase">
              Select New Role
            </label>
            <select
              value={selectedRoleId || staff.roleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full rounded-lg bg-surface-container-lowest border border-[#e5e7eb] px-3.5 py-2 font-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
            <p className="mt-1.5 font-body-sm text-secondary text-[11px]">
              System privileges and access grants will be updated immediately
              upon confirmation.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#edeef0]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 font-label-md text-secondary hover:text-on-surface transition-colors cursor-pointer uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-neutral-800 text-on-primary font-label-md uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
