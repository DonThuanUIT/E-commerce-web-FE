import React from 'react';
import { History, ShieldCheck, RefreshCw } from 'lucide-react';

interface AuditLogHeaderProps {
  totalCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const AuditLogHeader: React.FC<AuditLogHeaderProps> = ({
  totalCount,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-gray-700 uppercase mb-1">
          <span>TELEMETRY PIPELINE // AUDIT_STREAM</span>
          <span className="text-gray-700 font-bold">•</span>
          <span className="text-gray-700 font-semibold">MXP_NODE_01</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-xs">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 font-serif uppercase">
              NHẬT KÝ KIỂM TOÁN (AUDIT LOGS)
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Truy vết và thanh tra mọi hoạt động thay đổi cấu hình, phân quyền
              và dữ liệu hệ thống
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 shadow-2xs text-gray-700">
            <span className="font-semibold text-gray-900">{totalCount}</span>{' '}
            bản ghi ghi nhận
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Toàn vẹn dữ liệu hệ thống</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold tracking-wider text-gray-800 uppercase hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-gray-900' : ''}`}
        />
        Làm Mới Dữ Liệu
      </button>
    </div>
  );
};
