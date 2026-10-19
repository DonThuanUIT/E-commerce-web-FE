import { axiosInstance } from '../../../config/axios';
import type { ApiResponse } from '../../../shared/types/apiType';
import type {
  ChangeStaffRoleCommand,
  CreateStaffCommand,
  SetStaffPasswordCommand,
  StaffMember,
  StaffPageResponse,
  StaffQueryParams,
  StaffRole,
} from '../types/staffType';

/**
 * Administrative Staff Management API Service.
 * Interacts directly with CNWeb_BE endpoints.
 */
export const staffService = {
  /**
   * Retrieves paginated list of staff members matching optional filters.
   */
  async getStaffList(params?: StaffQueryParams): Promise<StaffPageResponse> {
    const response = await axiosInstance.get<ApiResponse<StaffPageResponse>>(
      '/v1/admin/staff',
      { params },
    );
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data?.error?.message || 'Không thể tải danh sách nhân viên',
    );
  },

  /**
   * Retrieves single staff member details by UUID.
   */
  async getStaffById(id: string): Promise<StaffMember> {
    const response = await axiosInstance.get<ApiResponse<StaffMember>>(
      `/v1/admin/staff/${id}`,
    );
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data?.error?.message || 'Không tìm thấy thông tin nhân viên',
    );
  },

  /**
   * Fetches available roles for assignment dropdowns.
   */
  async getRoles(): Promise<StaffRole[]> {
    const response =
      await axiosInstance.get<ApiResponse<StaffRole[]>>('/v1/admin/roles');
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data?.error?.message || 'Không thể tải danh mục vai trò',
    );
  },

  /**
   * Creates a new staff member and triggers invitation email.
   */
  async createStaff(command: CreateStaffCommand): Promise<StaffMember> {
    const response = await axiosInstance.post<ApiResponse<StaffMember>>(
      '/v1/admin/staff',
      command,
    );
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data?.error?.message || 'Không thể tạo nhân viên mới',
    );
  },

  /**
   * Resends invitation setup email to a staff member.
   */
  async resendInvitation(id: string): Promise<void> {
    const response = await axiosInstance.post<ApiResponse<void>>(
      `/v1/admin/staff/${id}/resend-invitation`,
    );
    if (response.data && response.data.success) {
      return;
    }
    throw new Error(
      response.data?.error?.message || 'Không thể gửi lại email kích hoạt',
    );
  },

  /**
   * Locks a staff account and revokes active sessions.
   */
  async lockStaff(id: string): Promise<StaffMember> {
    const response = await axiosInstance.patch<ApiResponse<StaffMember>>(
      `/v1/admin/staff/${id}/lock`,
    );
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data?.error?.message || 'Không thể khoá tài khoản nhân viên',
    );
  },

  /**
   * Unlocks a previously locked staff account.
   */
  async unlockStaff(id: string): Promise<StaffMember> {
    const response = await axiosInstance.patch<ApiResponse<StaffMember>>(
      `/v1/admin/staff/${id}/unlock`,
    );
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data?.error?.message || 'Không thể mở khoá tài khoản nhân viên',
    );
  },

  /**
   * Changes the assigned role for a staff member.
   */
  async changeRole(
    id: string,
    command: ChangeStaffRoleCommand,
  ): Promise<StaffMember> {
    const response = await axiosInstance.patch<ApiResponse<StaffMember>>(
      `/v1/admin/staff/${id}/role`,
      command,
    );
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data?.error?.message || 'Không thể thay đổi vai trò nhân viên',
    );
  },

  /**
   * Sets initial password using the setup token from email.
   */
  async setPassword(command: SetStaffPasswordCommand): Promise<string> {
    const response = await axiosInstance.post<ApiResponse<string>>(
      '/v1/auth/staff/set-password',
      command,
    );
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data?.error?.message || 'Thiết lập mật khẩu không thành công',
    );
  },
};
