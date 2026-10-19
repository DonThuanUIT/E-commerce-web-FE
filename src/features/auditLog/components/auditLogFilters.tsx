import React from 'react';
import { Filter, X } from 'lucide-react';

interface AuditLogFiltersProps {
  entityType: string;
  onEntityTypeChange: (val: string) => void;
  action: string;
  onActionChange: (val: string) => void;
  fromDate: string;
  onFromDateChange: (val: string) => void;
  toDate: string;
  onToDateChange: (val: string) => void;
  onReset: () => void;
}

const COMMON_ENTITIES = [
  { label: 'Tất cả thực thể', value: '' },
  { label: 'Nhân viên (STAFF)', value: 'STAFF' },
  { label: 'Vai trò (ROLE)', value: 'ROLE' },
  { label: 'Sản phẩm (PRODUCT)', value: 'PRODUCT' },
  { label: 'Đơn hàng (ORDER)', value: 'ORDER' },
  { label: 'Vận chuyển (SHIPMENT)', value: 'SHIPMENT' },
];

const COMMON_ACTIONS = [
  { label: 'Tất cả hành động', value: '' },
  { label: 'Tạo mới (CREATE)', value: 'CREATE' },
  { label: 'Cập nhật (UPDATE)', value: 'UPDATE' },
  { label: 'Khoá tài khoản (LOCK)', value: 'LOCK' },
  { label: 'Mở khoá (UNLOCK)', value: 'UNLOCK' },
  { label: 'Đổi vai trò (CHANGE_ROLE)', value: 'CHANGE_ROLE' },
  { label: 'Xoá (DELETE)', value: 'DELETE' },
];

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  entityType,
  onEntityTypeChange,
  action,
  onActionChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  onReset,
}) => {
  const hasActiveFilters = Boolean(entityType || action || fromDate || toDate);

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white border border-gray-200 rounded-xl p-3 shadow-2xs">
      <div className="flex flex-wrap items-center gap-2">
        {/* Entity Type Dropdown */}
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
          <select
            value={entityType}
            onChange={(e) => onEntityTypeChange(e.target.value)}
            className="bg-transparent text-xs text-gray-700 focus:outline-none cursor-pointer"
          >
            {COMMON_ENTITIES.map((ent) => (
              <option key={ent.value} value={ent.value}>
                {ent.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Dropdown */}
        <select
          value={action}
          onChange={(e) => onActionChange(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-xs text-gray-700 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
        >
          {COMMON_ACTIONS.map((act) => (
            <option key={act.value} value={act.value}>
              {act.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Inputs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>Từ:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>Đến:</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:border-black"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Xoá bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};
