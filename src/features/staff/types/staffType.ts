import type { PageResponse } from '../../../shared/types/apiType';

/**
 * Staff account status enum/constants.
 * 1 = ACTIVE, 2 = LOCKED
 */
export const StaffStatus = {
  ACTIVE: 1,
  LOCKED: 2,
} as const;

export type StaffStatusType = (typeof StaffStatus)[keyof typeof StaffStatus];

/**
 * Public read model for a staff member.
 */
export interface StaffMember {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
  roleCode: string;
  roleName: string;
  status: StaffStatusType;
  createdAt: string;
  updatedAt: string;
}

/**
 * Role model for assignment dropdowns.
 */
export interface StaffRole {
  id: string;
  code: string;
  name: string;
}

/**
 * Query parameters for filtering and paginating staff list.
 */
export interface StaffQueryParams {
  keyword?: string;
  status?: number;
  roleId?: string;
  page?: number;
  size?: number;
}

/**
 * Command payload for creating a new staff member.
 */
export interface CreateStaffCommand {
  email: string;
  fullName: string;
  roleId: string;
}

/**
 * Command payload for updating a staff member's role.
 */
export interface ChangeStaffRoleCommand {
  roleId: string;
}

/**
 * Command payload for setting an initial password via invitation token.
 */
export interface SetStaffPasswordCommand {
  token: string;
  newPassword: string;
}

export type StaffPageResponse = PageResponse<StaffMember>;
