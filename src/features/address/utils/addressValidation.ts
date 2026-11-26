import type { CreateAddressPayload } from '../types/addressType';

export type AddressFormErrors = Partial<
  Record<keyof CreateAddressPayload, string>
>;

const PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/;

/**
 * Validates customer delivery address fields matching CNWeb_BE
 * `CreateCustomerAddressCommand` constraints.
 */
export function validateAddressPayload(
  payload: CreateAddressPayload,
): AddressFormErrors {
  const errors: AddressFormErrors = {};

  const recipientName = payload.recipientName.trim();
  if (!recipientName) {
    errors.recipientName = 'Recipient name is required';
  } else if (recipientName.length > 255) {
    errors.recipientName = 'Recipient name must not exceed 255 characters';
  }

  const phone = payload.phone.trim();
  if (!phone) {
    errors.phone = 'Phone number is required';
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phone = 'Phone number is invalid (e.g. 0912345678 or +84912345678)';
  }

  const province = payload.province.trim();
  if (!province) {
    errors.province = 'Province is required';
  } else if (province.length > 255) {
    errors.province = 'Province must not exceed 255 characters';
  }

  const district = payload.district.trim();
  if (!district) {
    errors.district = 'District is required';
  } else if (district.length > 255) {
    errors.district = 'District must not exceed 255 characters';
  }

  const ward = payload.ward.trim();
  if (!ward) {
    errors.ward = 'Ward is required';
  } else if (ward.length > 255) {
    errors.ward = 'Ward must not exceed 255 characters';
  }

  const addressLine = payload.addressLine.trim();
  if (!addressLine) {
    errors.addressLine = 'Address line is required';
  }

  return errors;
}

export function hasAddressErrors(errors: AddressFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
