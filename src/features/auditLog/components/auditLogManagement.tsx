import React, { useState } from 'react';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { AuditLogHeader } from './auditLogHeader';
import { AuditLogFilters } from './auditLogFilters';
import { AuditLogTable } from './auditLogTable';
import { AuditLogDrawer } from './auditLogDrawer';
import type { AuditLog, AuditLogQuery } from '../types/auditLogType';

export const AuditLogManagement: React.FC = () => {
  const [filters, setFilters] = useState<AuditLogQuery>({
    entityType: undefined,
    action: undefined,
    actorId: undefined,
    fromDate: undefined,
    toDate: undefined,
  });
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAuditLogs({
      ...filters,
      page,
      size: pageSize,
    });

  const handleFilterChange = (newFilters: Partial<AuditLogQuery>) => {
    setFilters((prev: AuditLogQuery) => ({ ...prev, ...newFilters }));
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      entityType: undefined,
      action: undefined,
      actorId: undefined,
      fromDate: undefined,
      toDate: undefined,
    });
    setPage(0);
  };

  const handleExportJson = () => {
    if (!data || !data.items.length) {
      alert('No audit log records available to export as JSON');
      return;
    }
    const blob = new Blob([JSON.stringify(data.items, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atelier-audit-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalCount = data?.totalElements || 0;

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Stitch Screen 10 Header with Bento Metric Cards */}
      <AuditLogHeader
        totalCount={totalCount}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
        onExportJson={handleExportJson}
      />

      {/* Stitch Screen 10 Filters Strip */}
      <AuditLogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Stitch Screen 10 Dense Table with Inline Diff Expansion */}
      <AuditLogTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onPageChange={setPage}
        onSelectLog={(log) => setSelectedLog(log)}
      />

      {/* Full Forensic Trace Drawer */}
      <AuditLogDrawer
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};
