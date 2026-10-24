import React from 'react';
import { Filter, X, Calendar, User } from 'lucide-react';
import type { AuditLogQuery } from '../types/auditLogType';

interface AuditLogFiltersProps {
  filters: AuditLogQuery;
  onFilterChange: (newFilters: Partial<AuditLogQuery>) => void;
  onReset: () => void;
}

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const entityPills = [
    { label: 'ALL ENTITIES', value: undefined },
    { label: 'PRODUCT', value: 'PRODUCT' },
    { label: 'STAFF', value: 'STAFF' },
    { label: 'ORDER', value: 'ORDER' },
    { label: 'INVENTORY', value: 'INVENTORY' },
    { label: 'AUTH', value: 'AUTH' },
  ];

  const actions = [
    { label: 'All Operations', value: '' },
    { label: 'CREATE (Initial Provisioning)', value: 'CREATE' },
    { label: 'UPDATE (State Mutation)', value: 'UPDATE' },
    { label: 'DELETE (Record Removal)', value: 'DELETE' },
    { label: 'LOCK (Revoke Access)', value: 'LOCK' },
    { label: 'UNLOCK (Restore Access)', value: 'UNLOCK' },
    { label: 'ROLE_CHANGE (Role Partitioning)', value: 'ROLE_CHANGE' },
  ];

  const hasActiveFilters = Boolean(
    filters.entityType ||
    filters.action ||
    filters.actorId ||
    filters.fromDate ||
    filters.toDate,
  );

  return (
    <div className="rounded-lg bg-surface-container-lowest border border-[#e5e7eb] p-space-md space-y-3 shadow-sm">
      {/* Top filter row: Dropdowns & inputs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Action Select */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-[#e5e7eb]">
            <Filter className="h-3.5 w-3.5 text-secondary" />
            <select
              value={filters.action || ''}
              onChange={(e) =>
                onFilterChange({
                  action: e.target.value || undefined,
                })
              }
              className="bg-transparent text-xs font-body-sm text-on-surface focus:outline-none cursor-pointer"
            >
              {actions.map((act) => (
                <option
                  key={act.value}
                  value={act.value}
                  className="bg-surface-container-lowest text-on-surface"
                >
                  {act.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actor / Staff ID Search Input */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-[#e5e7eb] flex-1 min-w-[200px]">
            <User className="h-3.5 w-3.5 text-secondary" />
            <input
              type="text"
              value={filters.actorId || ''}
              onChange={(e) =>
                onFilterChange({
                  actorId: e.target.value.trim() || undefined,
                })
              }
              placeholder="Filter by Operator / Actor UUID..."
              className="bg-transparent text-xs font-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none w-full"
            />
          </div>

          {/* Date range picker trigger */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-[#e5e7eb]">
            <Calendar className="h-3.5 w-3.5 text-secondary" />
            <input
              type="date"
              value={filters.fromDate ? filters.fromDate.slice(0, 10) : ''}
              onChange={(e) =>
                onFilterChange({
                  fromDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                })
              }
              className="bg-transparent text-xs font-body-sm text-on-surface focus:outline-none cursor-pointer"
            />
            <span className="text-secondary text-xs">→</span>
            <input
              type="date"
              value={filters.toDate ? filters.toDate.slice(0, 10) : ''}
              onChange={(e) =>
                onFilterChange({
                  toDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                })
              }
              className="bg-transparent text-xs font-body-sm text-on-surface focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-xs font-label-sm text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Entity Type Filter Pills matching Stitch Screen 10 */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#edeef0]">
        <span className="font-label-sm uppercase text-secondary mr-1">
          Entity Scope:
        </span>
        {entityPills.map((pill) => {
          const isSelected = filters.entityType === pill.value;
          return (
            <button
              key={pill.label}
              type="button"
              onClick={() => onFilterChange({ entityType: pill.value })}
              className={`px-2.5 py-1 rounded-lg font-label-sm uppercase tracking-wider transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-secondary hover:text-on-surface'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
