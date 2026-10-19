import React from 'react';
import {
  X,
  ShieldAlert,
  Clock,
  Globe,
  Laptop,
  Database,
  ArrowRight,
} from 'lucide-react';
import type { AuditLog } from '../types/auditLogType';
import { AuditLogDiffViewer } from './auditLogDiffViewer';

interface AuditLogDrawerProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({
  log,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !log) return null;

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'UPDATE':
      case 'CHANGE_ROLE':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'DELETE':
      case 'LOCK':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-xl bg-white border-l border-gray-200 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 font-serif uppercase">
                    Chi Tiết Nhật Ký Kiểm Toán
                  </h2>
                  <p className="text-[11px] font-mono text-gray-500">
                    ID: {log.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Event Summary Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md font-semibold border ${getActionColor(
                  log.action,
                )}`}
              >
                {log.action}
              </span>
              <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 font-mono text-[11px]">
                <Clock className="h-3 w-3 text-gray-400" />
                {new Date(log.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>

            {/* Metadata Card */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Database className="h-3.5 w-3.5 text-gray-500" />
                  <span>Thực thể tác động:</span>
                </div>
                <div className="flex items-center gap-1 font-mono font-medium text-gray-900">
                  <span className="text-indigo-700">{log.entityType}</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                  <span className="truncate max-w-[150px]">{log.entityId}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <span>Tác tử thực hiện:</span>
                </div>
                <span className="font-mono text-gray-800">{log.actorId}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  <span>Địa chỉ IP:</span>
                </div>
                <span className="font-mono text-gray-800">
                  {log.ip || 'N/A'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-gray-600 mb-1">
                  <Laptop className="h-3.5 w-3.5 text-gray-400" />
                  <span>User Agent:</span>
                </div>
                <p className="font-mono text-[11px] text-gray-600 break-all bg-white p-2 rounded border border-gray-200">
                  {log.userAgent || 'N/A'}
                </p>
              </div>
            </div>

            {/* Diff Viewer */}
            <div className="pt-2">
              <AuditLogDiffViewer
                beforeState={log.beforeState}
                afterState={log.afterState}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
