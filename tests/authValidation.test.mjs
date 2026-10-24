import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  validateRegisterForm,
} from '../src/features/auth/utils/validation.ts';

test('EMAIL_REGEX validates standard email formats', () => {
  const validEmails = [
    'customer@example.com',
    'elena.rostova@maison.vn',
    'user+tag@domain.co.uk',
    'firstname.lastname@company.org',
  ];

  for (const email of validEmails) {
    assert.equal(
      EMAIL_REGEX.test(email),
      true,
      `Should accept valid email: ${email}`,
    );
  }

  const invalidEmails = [
    '',
    'plainaddress',
    'missingatsign.com',
    '@nodomain.com',
    'user@.com',
    'user@domain..com',
  ];

  for (const email of invalidEmails) {
    assert.equal(
      EMAIL_REGEX.test(email),
      false,
      `Should reject invalid email: ${email}`,
    );
  }
});

test('PASSWORD_REGEX enforces length and character variety', () => {
  const validPasswords = [
    'Password123',
    'SecurePass1',
    'Abcdefg1',
    'Luxury2026!',
  ];

  for (const pwd of validPasswords) {
    assert.equal(
      PASSWORD_REGEX.test(pwd),
      true,
      `Should accept valid password: ${pwd}`,
    );
  }

  const invalidPasswords = [
    'alllowercase1', // missing uppercase
    'ALLUPPERCASE1', // missing lowercase
    'NoDigitsHere', // missing digit
  ];

  for (const pwd of invalidPasswords) {
    assert.equal(
      PASSWORD_REGEX.test(pwd),
      false,
      `Should reject invalid password: ${pwd}`,
    );
  }
});

test('validateRegisterForm flags missing required fields', () => {
  const emptyValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  };

  const errors = validateRegisterForm(emptyValues);

  assert.equal(errors.fullName, 'Full name is required');
  assert.equal(errors.email, 'Email is required');
  assert.equal(errors.password, 'Password is required');
  assert.equal(errors.confirmPassword, 'Please confirm your password');
});

test('validateRegisterForm flags password mismatch', () => {
  const mismatchedValues = {
    fullName: 'Nguyen Van A',
    email: 'customer@example.com',
    password: 'Password123',
    confirmPassword: 'Password456',
    acceptTerms: true,
  };

  const errors = validateRegisterForm(mismatchedValues);

  assert.equal(errors.fullName, undefined);
  assert.equal(errors.email, undefined);
  assert.equal(errors.password, undefined);
  assert.equal(errors.confirmPassword, 'Passwords do not match');
});

test('validateRegisterForm accepts valid inputs', () => {
  const validValues = {
    fullName: 'Elena Rostova',
    email: 'elena.rostova@maison.vn',
    password: 'Password123',
    confirmPassword: 'Password123',
    acceptTerms: true,
  };

  const errors = validateRegisterForm(validValues);

  assert.deepEqual(errors, {});
});
