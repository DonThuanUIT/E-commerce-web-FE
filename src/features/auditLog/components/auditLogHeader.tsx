import React from 'react';
import { Download, RefreshCw } from 'lucide-react';

interface AuditLogHeaderProps {
  totalCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExportJson?: () => void;
}

export const AuditLogHeader: React.FC<AuditLogHeaderProps> = ({
  totalCount,
  onRefresh,
  isRefreshing,
  onExportJson,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Top Telemetry Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg pb-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs mb-1">
            <span className="font-label-sm text-secondary uppercase tracking-widest">
              TELEMETRY PIPELINE // AUDIT_STREAM
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary" />
            <span className="font-label-sm text-secondary">LIVE EVENTS</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-on-surface tracking-tight uppercase">
              Audit Trail & System Mutation Logs
            </h1>
          </div>

          <p className="font-body-sm text-secondary mt-1 max-w-2xl">
            Real-time immutable audit event stream for configuration changes,
            security mutations, and administrative operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm self-start md:self-auto">
          {/* Real Total Event Counter Badge */}
          <div className="bg-surface-container px-space-md py-2 rounded-lg flex items-center gap-space-xs text-on-surface border border-[#e5e7eb]">
            <span className="font-label-sm text-secondary uppercase">
              Total Logged:
            </span>
            <span className="font-label-md text-on-surface font-semibold">
              {totalCount.toLocaleString()} EVENTS
            </span>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-[38px] px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md uppercase tracking-wider flex items-center gap-2 rounded-lg border border-[#e5e7eb] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-primary' : 'text-secondary'}`}
            />
            <span>Refresh</span>
          </button>

          {/* Export Forensic JSON */}
          <button
            type="button"
            onClick={onExportJson}
            className="h-[38px] px-space-md bg-primary hover:bg-neutral-800 text-on-primary font-label-md uppercase tracking-wider flex items-center gap-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Forensic JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
