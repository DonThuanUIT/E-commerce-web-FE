import assert from 'node:assert/strict';
import test from 'node:test';
import {
  hasAddressErrors,
  validateAddressPayload,
} from '../src/features/address/utils/addressValidation.ts';

test('validateAddressPayload passes for valid Vietnam phone and fields', () => {
  const errors = validateAddressPayload({
    recipientName: 'Nguyen Van A',
    phone: '0912345678',
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    addressLine: '123 Le Loi',
    isDefault: true,
  });
  assert.equal(hasAddressErrors(errors), false);
});

test('validateAddressPayload accepts +84 format and rejects invalid phone', () => {
  const validIntl = validateAddressPayload({
    recipientName: 'Nguyen Van A',
    phone: '+84912345678',
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    addressLine: '123 Le Loi',
  });
  assert.equal(hasAddressErrors(validIntl), false);

  const invalid = validateAddressPayload({
    recipientName: '',
    phone: '12345',
    province: '',
    district: '',
    ward: '',
    addressLine: '',
  });
  assert.equal(hasAddressErrors(invalid), true);
  assert.ok(invalid.recipientName);
  assert.ok(invalid.phone);
  assert.ok(invalid.province);
  assert.ok(invalid.district);
  assert.ok(invalid.ward);
  assert.ok(invalid.addressLine);
});
