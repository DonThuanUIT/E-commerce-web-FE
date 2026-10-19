import React, { useState } from 'react';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { AuditLogHeader } from './auditLogHeader';
import { AuditLogFilters } from './auditLogFilters';
import { AuditLogTable } from './auditLogTable';
import { AuditLogDrawer } from './auditLogDrawer';
import type { AuditLog } from '../types/auditLogType';

export const AuditLogManagement: React.FC = () => {
  const [entityType, setEntityType] = useState('');
  const [action, setAction] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAuditLogs({
      entityType: entityType || undefined,
      action: action || undefined,
      fromDate: fromDate ? new Date(fromDate).toISOString() : undefined,
      toDate: toDate
        ? new Date(toDate + 'T23:59:59Z').toISOString()
        : undefined,
      page,
      size: pageSize,
    });

  const handleResetFilters = () => {
    setEntityType('');
    setAction('');
    setFromDate('');
    setToDate('');
    setPage(0);
  };

  const totalCount = data?.totalElements || 0;

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <AuditLogHeader
        totalCount={totalCount}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />

      <AuditLogFilters
        entityType={entityType}
        onEntityTypeChange={(val) => {
          setEntityType(val);
          setPage(0);
        }}
        action={action}
        onActionChange={(val) => {
          setAction(val);
          setPage(0);
        }}
        fromDate={fromDate}
        onFromDateChange={(val) => {
          setFromDate(val);
          setPage(0);
        }}
        toDate={toDate}
        onToDateChange={(val) => {
          setToDate(val);
          setPage(0);
        }}
        onReset={handleResetFilters}
      />

      <AuditLogTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onPageChange={setPage}
        onSelectLog={(log) => setSelectedLog(log)}
      />

      <AuditLogDrawer
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};
