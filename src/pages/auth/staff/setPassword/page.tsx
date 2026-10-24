import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { SetPasswordForm } from '../../../../features/staff';

export const StaffSetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-4">
      {/* Brand logo top mark */}
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary font-headline-sm text-sm tracking-widest shadow-sm">
          A
        </div>
        <div className="text-left">
          <span className="font-headline-sm text-on-surface uppercase block leading-tight">
            ATELIER
          </span>
          <span className="font-label-sm text-secondary uppercase block">
            CORE // SEC-OPS
          </span>
        </div>
      </div>

      {token ? (
        <SetPasswordForm token={token} />
      ) : (
        <div className="w-full max-w-md rounded-lg bg-surface-container-lowest border border-error p-8 text-center text-on-surface shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-error-container text-error mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="font-label-sm tracking-widest text-error uppercase mb-1">
            SECURITY EXCEPTION // TOKEN_MISSING
          </div>
          <h2 className="font-headline-sm text-on-surface uppercase">
            Missing or Invalid Activation Token
          </h2>
          <p className="font-body-sm text-secondary mt-2.5 leading-relaxed">
            The security activation token parameter was not found in the URL.
            Please verify the full activation link in your invitation email or
            contact your System Administrator to request a new invitation.
          </p>
          <div className="mt-6 pt-4 border-t border-[#edeef0] flex items-center justify-center gap-2 font-label-sm text-secondary">
            <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
            <span>Atelier Cryptographic Verification</span>
          </div>
        </div>
      )}
    </div>
  );
};
