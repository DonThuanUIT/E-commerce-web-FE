import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { VIETNAM_PROVINCES } from '../data/vietnamProvinces';
import type {
  CreateAddressPayload,
  CustomerAddress,
} from '../types/addressType';
import {
  type AddressFormErrors,
  hasAddressErrors,
  validateAddressPayload,
} from '../utils/addressValidation';
import { SearchableSelect } from './searchableSelect';

interface AddressFormModalProps {
  isOpen: boolean;
  editingAddress: CustomerAddress | null;
  totalAddressCount: number;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAddressPayload) => Promise<void>;
}

/**
 * Shared modal for creating and editing a customer delivery address.
 */
export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  editingAddress,
  totalAddressCount,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(editingAddress);
  const isOnlyAddress = isEditing
    ? totalAddressCount <= 1
    : totalAddressCount === 0;

  const [recipientName, setRecipientName] = useState(
    editingAddress?.recipientName ?? '',
  );
  const [phone, setPhone] = useState(editingAddress?.phone ?? '');
  const [province, setProvince] = useState(editingAddress?.province ?? '');
  const [district, setDistrict] = useState(editingAddress?.district ?? '');
  const [ward, setWard] = useState(editingAddress?.ward ?? '');
  const [addressLine, setAddressLine] = useState(
    editingAddress?.addressLine ?? '',
  );
  const [isDefault, setIsDefault] = useState<boolean>(
    editingAddress ? editingAddress.isDefault : totalAddressCount === 0,
  );
  const [errors, setErrors] = useState<AddressFormErrors>({});

  const selectedProvince = useMemo(
    () => VIETNAM_PROVINCES.find((p) => p.name === province),
    [province],
  );
  const districtOptions = useMemo(
    () => selectedProvince?.districts ?? [],
    [selectedProvince],
  );

  const selectedDistrict = useMemo(
    () => districtOptions.find((d) => d.name === district),
    [districtOptions, district],
  );
  const wardOptions = useMemo(
    () => selectedDistrict?.wards ?? [],
    [selectedDistrict],
  );

  if (!isOpen) return null;

  const handleProvinceChange = (nextProvince: string) => {
    setProvince(nextProvince);
    setDistrict('');
    setWard('');
    setErrors((prev) => ({
      ...prev,
      province: undefined,
      district: undefined,
      ward: undefined,
    }));
  };

  const handleDistrictChange = (nextDistrict: string) => {
    setDistrict(nextDistrict);
    setWard('');
    setErrors((prev) => ({
      ...prev,
      district: undefined,
      ward: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateAddressPayload = {
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      province: province.trim(),
      district: district.trim(),
      ward: ward.trim(),
      addressLine: addressLine.trim(),
      isDefault: isOnlyAddress ? true : isDefault,
    };

    const validationErrors = validateAddressPayload(payload);
    if (hasAddressErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-modal-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">
              {isEditing ? 'Update Destination' : 'Register Destination'}
            </p>
            <h2
              id="address-modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {isEditing ? 'Edit Delivery Address' : 'Add New Address'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="address-recipient"
                className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-700 uppercase"
              >
                Recipient Name
              </label>
              <input
                id="address-recipient"
                type="text"
                value={recipientName}
                onChange={(e) => {
                  setRecipientName(e.target.value);
                  setErrors((prev) => ({ ...prev, recipientName: undefined }));
                }}
                placeholder="Nguyen Van A"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none ${
                  errors.recipientName ? 'border-rose-400' : 'border-gray-300'
                }`}
              />
              {errors.recipientName && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.recipientName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address-phone"
                className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-700 uppercase"
              >
                Phone Number
              </label>
              <input
                id="address-phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="0912345678"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none ${
                  errors.phone ? 'border-rose-400' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SearchableSelect
              id="address-province"
              label="Province / City"
              value={province}
              options={VIETNAM_PROVINCES}
              placeholder="Select province"
              error={errors.province}
              onChange={handleProvinceChange}
            />
            <SearchableSelect
              id="address-district"
              label="District"
              value={district}
              options={districtOptions}
              placeholder="Select district"
              disabled={!province}
              error={errors.district}
              onChange={handleDistrictChange}
            />
            <SearchableSelect
              id="address-ward"
              label="Ward"
              value={ward}
              options={wardOptions}
              placeholder="Select ward"
              disabled={!district}
              error={errors.ward}
              onChange={(nextWard) => {
                setWard(nextWard);
                setErrors((prev) => ({ ...prev, ward: undefined }));
              }}
            />
          </div>

          <div>
            <label
              htmlFor="address-line"
              className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-700 uppercase"
            >
              Street Address
            </label>
            <textarea
              id="address-line"
              rows={2}
              value={addressLine}
              onChange={(e) => {
                setAddressLine(e.target.value);
                setErrors((prev) => ({ ...prev, addressLine: undefined }));
              }}
              placeholder="1 Vo Van Ngan Street, Apt 4B"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none ${
                errors.addressLine ? 'border-rose-400' : 'border-gray-300'
              }`}
            />
            {errors.addressLine && (
              <p className="mt-1 text-xs text-rose-600">{errors.addressLine}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800 select-none">
              <input
                type="checkbox"
                checked={isOnlyAddress ? true : isDefault}
                disabled={isOnlyAddress}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-black disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span>Set as default delivery address</span>
            </label>
            {isOnlyAddress && (
              <span className="text-[11px] text-gray-500">
                Required for primary address
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold tracking-wider text-gray-700 uppercase transition hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-black px-5 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
