import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Copy,
  Check,
  Calendar,
  Globe,
  Loader2,
  AlertCircle,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { AuditLog, AuditLogPageResponse } from '../types/auditLogType';
import { AuditLogDiffViewer } from './auditLogDiffViewer';

interface AuditLogTableProps {
  data: AuditLogPageResponse | null | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onSelectLog: (log: AuditLog) => void;
  onPageChange: (page: number) => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  data,
  isLoading,
  isError,
  error,
  onSelectLog,
  onPageChange,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getActionBadgeColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'UPDATE':
        return 'bg-surface-container text-on-surface border-outline-variant';
      case 'DELETE':
      case 'LOCK':
        return 'bg-red-100 text-red-900 border-red-200';
      case 'ROLE_CHANGE':
        return 'bg-secondary-container text-on-secondary-container border-secondary';
      default:
        return 'bg-surface-container text-secondary border-[#e5e7eb]';
    }
  };

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 rounded-lg bg-surface-container-lowest border border-[#e5e7eb] shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-secondary mb-3" />
        <p className="text-xs font-label-sm text-secondary uppercase tracking-wider">
          Indexing and decrypting immutable audit log stream...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-lg bg-error-container border border-error text-center shadow-sm">
        <AlertCircle className="h-8 w-8 text-error mb-3" />
        <p className="text-sm font-semibold text-on-error-container">
          Failed to load audit logs
        </p>
        <p className="text-xs text-on-error-container/80 mt-1 font-body-sm">
          {error?.message || 'Server connection error'}
        </p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 rounded-lg bg-surface-container-lowest border border-[#e5e7eb] text-center shadow-sm">
        <Shield className="h-10 w-10 text-secondary mb-3" />
        <p className="text-sm font-semibold text-on-surface">
          No matching audit entries found
        </p>
        <p className="text-xs text-secondary mt-1 font-body-sm">
          Adjust filter criteria or date range to inspect historical events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-[#e5e7eb] bg-surface-container-lowest shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-container-high text-secondary font-label-sm uppercase tracking-wider">
              <th className="py-3 px-space-md font-medium">Timestamp (UTC)</th>
              <th className="py-3 px-space-md font-medium">
                Operator Identity
              </th>
              <th className="py-3 px-space-md font-medium">Mutation Type</th>
              <th className="py-3 px-space-md font-medium">
                Target Entity & ID
              </th>
              <th className="py-3 px-space-md font-medium text-right">
                Forensic Trace
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-0 text-on-surface">
            {data.items.map((log) => {
              const isExpanded = expandedId === log.id;
              const hasDiff =
                Boolean(log.beforeState) || Boolean(log.afterState);

              return (
                <React.Fragment key={log.id}>
                  <tr
                    onClick={() => toggleExpand(log.id)}
                    className={`cursor-pointer transition-colors ${
                      isExpanded
                        ? 'bg-surface-container-low'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-space-md px-space-md font-body-sm text-secondary">
                      <div className="flex items-center gap-1.5 text-on-surface font-medium">
                        <Calendar className="h-3.5 w-3.5 text-secondary shrink-0" />
                        <span>
                          {new Date(log.createdAt).toLocaleTimeString('vi-VN')}
                        </span>
                      </div>
                      <span className="text-[10px] text-secondary block mt-0.5 font-label-sm">
                        {new Date(log.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </td>

                    {/* Operator Identity */}
                    <td className="py-space-md px-space-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-on-surface">
                            {log.actorId
                              ? `Staff #${log.actorId.slice(0, 8)}`
                              : 'System'}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-label-sm uppercase bg-surface-container text-secondary">
                            Type {log.actorType}
                          </span>
                        </div>
                        {log.ip && (
                          <div className="flex items-center gap-1 text-[10px] text-secondary font-body-sm mt-0.5">
                            <Globe className="h-2.5 w-2.5" />
                            <span>{log.ip}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Mutation Type */}
                    <td className="py-space-md px-space-md">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-label-sm uppercase tracking-wider border ${getActionBadgeColor(
                          log.action,
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Target Entity & ID */}
                    <td className="py-space-md px-space-md">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="text-on-surface font-bold uppercase font-label-sm">
                          {log.entityType}
                        </span>
                        <span className="text-secondary">:</span>
                        <span className="text-secondary truncate max-w-[120px] sm:max-w-[180px]">
                          {log.entityId}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyId(log.entityId, e)}
                          title="Copy Entity ID"
                          className="text-secondary hover:text-on-surface cursor-pointer"
                        >
                          {copiedId === log.entityId ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Forensic Trace Toggle */}
                    <td className="py-space-md px-space-md text-right">
                      <div className="inline-flex items-center gap-2">
                        {hasDiff && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(log.id);
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-label-sm uppercase transition-colors cursor-pointer ${
                              isExpanded
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container text-secondary hover:text-on-surface'
                            }`}
                          >
                            <span>
                              {isExpanded ? 'COLLAPSE' : 'VIEW DELTA'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLog(log);
                          }}
                          title="Open detailed forensic drawer"
                          className="p-1.5 rounded-lg text-secondary hover:text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Inline Expanded JSON Diff Viewer Row matching Stitch Screen 10 */}
                  {isExpanded && (
                    <tr className="bg-surface-container-low">
                      <td
                        colSpan={5}
                        className="p-4 sm:p-6 border-b border-[#e5e7eb]"
                      >
                        <AuditLogDiffViewer
                          beforeState={log.beforeState}
                          afterState={log.afterState}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="p-space-md bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-space-sm text-secondary font-label-sm border-t border-[#e5e7eb]">
          <div>
            Page{' '}
            <span className="text-on-surface font-semibold">
              {data.page + 1}
            </span>{' '}
            of{' '}
            <span className="text-on-surface font-semibold">
              {Math.max(1, data.totalPages)}
            </span>{' '}
            ({data.totalElements.toLocaleString()} total events)
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(0, data.page - 1))}
              disabled={data.first}
              className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              onClick={() => onPageChange(data.page + 1)}
              disabled={data.last}
              className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
