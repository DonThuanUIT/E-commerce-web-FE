import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { CustomerAddress } from '../types/addressType';

interface DeleteAddressModalProps {
  address: CustomerAddress | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

/**
 * Confirmation modal for deleting a customer delivery address.
 */
export const DeleteAddressModal: React.FC<DeleteAddressModalProps> = ({
  address,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  if (!address) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-address-title"
    >
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
            <h2
              id="delete-address-title"
              className="text-base font-semibold text-gray-900"
            >
              Delete Delivery Address
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 px-6 py-5 text-sm text-gray-600">
          <p>
            Are you sure you want to remove the address for{' '}
            <span className="font-semibold text-gray-900">
              {address.recipientName}
            </span>
            ?
          </p>
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-700">
            {address.addressLine}, {address.ward}, {address.district},{' '}
            {address.province}
          </p>
          {address.isDefault && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
              This is currently your <strong>default address</strong>. If you
              delete it, your most recent remaining address will automatically
              be set as the new default.
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold tracking-wider text-gray-700 uppercase hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold tracking-wider text-white uppercase hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isDeleting ? 'Deleting...' : 'Delete Address'}
          </button>
        </div>
      </div>
    </div>
  );
};
