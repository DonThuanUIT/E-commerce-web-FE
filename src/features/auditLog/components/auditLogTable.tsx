import React from 'react';
import {
  Calendar,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
} from 'lucide-react';
import type { AuditLog, AuditLogPageResponse } from '../types/auditLogType';

interface AuditLogTableProps {
  data: AuditLogPageResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onPageChange: (newPage: number) => void;
  onSelectLog: (log: AuditLog) => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  data,
  isLoading,
  isError,
  error,
  onPageChange,
  onSelectLog,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-xl shadow-2xs">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900 mb-2" />
        <p className="text-xs text-gray-500">
          Đang truy vấn nhật ký kiểm toán...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-rose-200 rounded-xl text-center shadow-2xs">
        <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
        <p className="text-sm font-semibold text-gray-900">
          Không thể tải dữ liệu nhật ký
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
          Không có bản ghi nhật ký phù hợp
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Hãy thử điều chỉnh bộ lọc ngày hoặc hành động kiểm toán.
        </p>
      </div>
    );
  }

  const getActionBadgeClass = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'UPDATE':
      case 'CHANGE_ROLE':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'DELETE':
      case 'LOCK':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'UNLOCK':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-semibold tracking-wider uppercase text-[11px]">
              <th className="py-3.5 px-4">Thời gian</th>
              <th className="py-3.5 px-4">Tác tử</th>
              <th className="py-3.5 px-4">Hành động</th>
              <th className="py-3.5 px-4">Thực thể</th>
              <th className="py-3.5 px-4">Địa chỉ IP</th>
              <th className="py-3.5 px-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {data.items.map((log) => {
              return (
                <tr
                  key={log.id}
                  onClick={() => onSelectLog(log)}
                  className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                >
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-gray-400 shrink-0" />
                      <span>
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      {log.actorId ? log.actorId.slice(0, 8) + '...' : 'System'}
                    </span>
                  </td>

                  {/* Action Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getActionBadgeClass(
                        log.action,
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  {/* Entity Type & ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900">
                        {log.entityType}
                      </span>
                      {log.entityId && (
                        <span className="text-[11px] font-mono text-gray-500">
                          #{log.entityId.slice(0, 6)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* IP */}
                  <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-gray-400 shrink-0" />
                      <span>{log.ip || '-'}</span>
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLog(log);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      Diff
                    </button>
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
          (Tổng cộng {data.totalElements} bản ghi kiểm toán)
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
