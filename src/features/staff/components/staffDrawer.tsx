import React, { useState } from 'react';
import {
  X,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
} from 'lucide-react';
import type { StaffRole, CreateStaffCommand } from '../types/staffType';

interface StaffDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateStaffCommand) => Promise<void> | Promise<boolean>;
  roles: StaffRole[];
  isLoading: boolean;
}

export const StaffDrawer: React.FC<StaffDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roles,
  isLoading,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState<string>('');
  const [emailConflictError, setEmailConflictError] = useState<string | null>(
    null,
  );
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentRoleId = roleId || (roles.length > 0 ? roles[0].id : '');
  const selectedRole = roles.find((r) => r.id === currentRoleId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailConflictError(null);
    setGeneralError(null);
    setSuccessToast(null);

    if (!fullName.trim()) {
      setGeneralError('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setGeneralError('Corporate email is required.');
      return;
    }
    if (!currentRoleId) {
      setGeneralError('Please select a security role.');
      return;
    }

    try {
      await onSubmit({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        roleId: currentRoleId,
      });

      setSuccessToast(
        'Activation link and account setup dispatched successfully via email.',
      );
      setTimeout(() => {
        setFullName('');
        setEmail('');
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      if (
        errorObj.response?.status === 409 ||
        errorObj.message?.includes('EMAIL_ALREADY_EXISTS')
      ) {
        setEmailConflictError(
          'This email is already registered in the directory.',
        );
      } else {
        setGeneralError(
          errorObj.response?.data?.message ||
            errorObj.message ||
            'Failed to enroll new operator. Please try again.',
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-surface-container-lowest border-l border-[#e5e7eb] shadow-2xl h-full flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-space-lg bg-surface-container-low border-b border-[#e5e7eb] flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-secondary uppercase tracking-widest">
                ACCESS_CONTROLLER // ONBOARDING
              </span>
              <span className="w-1 h-1 rounded-full bg-secondary" />
              <span className="font-label-sm text-secondary">
                HARDWARE ENFORCED
              </span>
            </div>
            <h2 className="font-headline-md text-on-surface uppercase">
              Enroll System Operator
            </h2>
            <p className="font-body-sm text-secondary mt-0.5">
              Create operator profile and dispatch initial credential setup
              token.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body Form */}
        <form
          onSubmit={handleSubmit}
          className="p-space-lg space-y-space-lg flex-1"
        >
          {successToast && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-label-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successToast}</span>
            </div>
          )}

          {generalError && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-error-container border border-error text-on-error-container text-xs font-label-sm">
              <AlertCircle className="h-4 w-4 shrink-0 text-error" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Section 01: Identity Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-space-xs pb-1 border-b border-[#edeef0]">
              <span className="font-label-sm text-secondary uppercase tracking-wider">
                01. Identity Details
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface uppercase">
                  Operator Full Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marc Jacobs"
                  className="h-[38px] px-3 bg-surface-container-lowest text-on-surface font-body-sm rounded-lg border border-[#e5e7eb] focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface uppercase">
                  Corporate Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailConflictError(null);
                  }}
                  placeholder="m.jacobs@atelier-os.internal"
                  className={`h-[38px] px-3 bg-surface-container-lowest text-on-surface font-body-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs ${
                    emailConflictError
                      ? 'border-error focus:ring-error'
                      : 'border-[#e5e7eb]'
                  }`}
                />
                {emailConflictError && (
                  <p className="mt-1 text-[11px] font-label-sm text-error flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {emailConflictError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface uppercase">
                Initial Security Role <span className="text-error">*</span>
              </label>
              <select
                value={currentRoleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full h-[38px] px-3 bg-surface-container-lowest text-on-surface font-body-sm rounded-lg border border-[#e5e7eb] focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 02: Granular Capabilities Matrix */}
          <div className="space-y-4">
            <div className="flex items-center gap-space-xs pb-1 border-b border-[#edeef0]">
              <span className="font-label-sm text-secondary uppercase tracking-wider">
                02. Capabilities Assigned by Role (
                {selectedRole?.code || 'DEFAULT'})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-[11px]">
              <div className="p-space-sm rounded-lg bg-surface-container-low border border-[#e5e7eb] flex items-center justify-between">
                <span className="font-body-sm text-on-surface">
                  Catalog & Product Management
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low border border-[#e5e7eb] flex items-center justify-between">
                <span className="font-body-sm text-on-surface">
                  Inventory Variants & Size Charts
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low border border-[#e5e7eb] flex items-center justify-between">
                <span className="font-body-sm text-on-surface">
                  Order Processing & Fulfillment
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low border border-[#e5e7eb] flex items-center justify-between">
                <span className="font-body-sm text-on-surface">
                  Returns & Refunds
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low border border-[#e5e7eb] flex items-center justify-between">
                <span className="font-body-sm text-on-surface">
                  Audit Log Access
                </span>
                <span className="font-label-sm text-secondary">ADMIN ONLY</span>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low border border-[#e5e7eb] flex items-center justify-between">
                <span className="font-body-sm text-on-surface">
                  Operator Role Provisioning
                </span>
                <span className="font-label-sm text-secondary">ADMIN ONLY</span>
              </div>
            </div>
          </div>

          {/* Hardware Key Requirement Warning Banner */}
          <div className="p-space-md rounded-lg bg-surface-container-low border border-[#e5e7eb] flex gap-3 text-xs">
            <KeyRound className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="font-label-sm font-bold text-on-surface uppercase">
                Security Credential Setup Requirement
              </p>
              <p className="font-body-sm text-secondary mt-1 leading-relaxed">
                An instruction email with a single-use activation link will be
                dispatched to the operator address (valid for 24 hours). The
                operator must complete verification and set up their password
                before accessing the administration portal.
              </p>
            </div>
          </div>
        </form>

        {/* Drawer Actions Footer */}
        <div className="p-space-lg border-t border-[#e5e7eb] bg-surface-container-low flex items-center justify-end gap-space-md sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-space-md py-2 text-secondary hover:text-on-surface font-label-md uppercase rounded-lg cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="h-[42px] px-space-lg bg-primary hover:bg-neutral-800 text-on-primary font-label-md uppercase tracking-wider flex items-center gap-2 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>Dispatch Token & Onboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
