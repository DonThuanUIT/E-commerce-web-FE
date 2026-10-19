import React from 'react';
import {
  Lock,
  Unlock,
  ShieldAlert,
  Send,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { StaffMember, StaffPageResponse } from '../types/staffType';

interface StaffTableProps {
  data: StaffPageResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onPageChange: (newPage: number) => void;
  onChangeRole: (staff: StaffMember) => void;
  onToggleLock: (staff: StaffMember) => void;
  onResendInvite: (staff: StaffMember) => void;
  resendingStaffId?: string | null;
}

export const StaffTable: React.FC<StaffTableProps> = ({
  data,
  isLoading,
  isError,
  error,
  onPageChange,
  onChangeRole,
  onToggleLock,
  onResendInvite,
  resendingStaffId,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-xl shadow-2xs">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900 mb-2" />
        <p className="text-xs text-gray-500">Đang tải danh sách nhân viên...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-rose-200 rounded-xl text-center shadow-2xs">
        <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
        <p className="text-sm font-semibold text-gray-900">
          Không thể tải dữ liệu
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {error?.message || 'Lỗi kết nối máy chủ'}
        </p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-xl text-center shadow-2xs">
        <p className="text-sm font-semibold text-gray-800">
          Không tìm thấy nhân viên nào
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Hãy thử thay đổi điều kiện tìm kiếm hoặc bộ lọc trạng thái.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-semibold tracking-wider uppercase text-[11px]">
              <th className="py-3.5 px-4">Nhân viên</th>
              <th className="py-3.5 px-4">Vai trò</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4">Ngày tham gia</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {data.items.map((staff) => {
              const isActive = staff.status === 1;
              const isResending = resendingStaffId === staff.id;

              return (
                <tr
                  key={staff.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {/* Staff Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white font-bold uppercase text-xs">
                        {staff.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {staff.fullName}
                        </p>
                        <p className="text-[11px] text-gray-500 font-mono">
                          {staff.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                      {staff.roleName || staff.roleCode}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        Đã khoá
                      </span>
                    )}
                  </td>

                  {/* Join Date */}
                  <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      {new Date(staff.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      {/* Resend invite */}
                      <button
                        type="button"
                        onClick={() => onResendInvite(staff)}
                        title="Gửi lại email kích hoạt"
                        disabled={isResending}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        {isResending ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-900" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>

                      {/* Change role */}
                      <button
                        type="button"
                        onClick={() => onChangeRole(staff)}
                        title="Thay đổi vai trò"
                        className="p-1.5 rounded-lg text-gray-500 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </button>

                      {/* Lock / Unlock */}
                      <button
                        type="button"
                        onClick={() => onToggleLock(staff)}
                        title={
                          isActive ? 'Khoá tài khoản' : 'Mở khoá tài khoản'
                        }
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isActive
                            ? 'text-gray-500 hover:text-rose-700 hover:bg-rose-50'
                            : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {isActive ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 px-1">
        <div>
          Trang{' '}
          <span className="font-semibold text-gray-900">{data.page + 1}</span> /{' '}
          <span className="font-semibold text-gray-900">
            {Math.max(1, data.totalPages)}
          </span>{' '}
          (Tổng cộng {data.totalElements} nhân viên)
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={data.first}
            onClick={() => onPageChange(data.page - 1)}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Trước
          </button>
          <button
            type="button"
            disabled={data.last}
            onClick={() => onPageChange(data.page + 1)}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
          >
            Sau
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
