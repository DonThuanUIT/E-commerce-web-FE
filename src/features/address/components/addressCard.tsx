import React from 'react';
import { Check, MapPin, Pencil, Phone, Trash2 } from 'lucide-react';
import type { CustomerAddress } from '../types/addressType';

interface AddressCardProps {
  address: CustomerAddress;
  isOnlyAddress: boolean;
  isSettingDefault: boolean;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (address: CustomerAddress) => void;
  onSetDefault: (id: string) => void;
}

/**
 * Displays a single customer delivery address card matching Stitch Screen 6.
 */
export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isOnlyAddress,
  isSettingDefault,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const disableDelete = address.isDefault && isOnlyAddress;

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border bg-white p-5 shadow-2xs transition ${
        address.isDefault ? 'border-black ring-1 ring-black' : 'border-gray-200'
      }`}
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {address.recipientName}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-600">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-mono">{address.phone}</span>
            </p>
          </div>
          {address.isDefault && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-white uppercase">
              <Check className="h-3 w-3" />
              Default
            </span>
          )}
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <p className="leading-relaxed">
            {address.addressLine}, {address.ward}, {address.district},{' '}
            {address.province}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
        <div>
          {!address.isDefault && (
            <button
              type="button"
              disabled={isSettingDefault}
              onClick={() => onSetDefault(address.id)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isSettingDefault ? 'Updating...' : 'Set as Default'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            disabled={disableDelete}
            title={
              disableDelete
                ? 'Cannot delete your only default address'
                : 'Delete address'
            }
            onClick={() => onDelete(address)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
