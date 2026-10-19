import React, { useState } from 'react';
import { Code2, Split } from 'lucide-react';

interface AuditLogDiffViewerProps {
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
}

export const AuditLogDiffViewer: React.FC<AuditLogDiffViewerProps> = ({
  beforeState,
  afterState,
}) => {
  const [viewMode, setViewMode] = useState<'diff' | 'raw'>('diff');

  const before = beforeState || {};
  const after = afterState || {};

  const allKeys = Array.from(
    new Set([...Object.keys(before), ...Object.keys(after)]),
  ).sort();

  return (
    <div className="space-y-3">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
          So Sánh Trạng Thái (Snapshot Diff)
        </span>
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-[11px]">
          <button
            type="button"
            onClick={() => setViewMode('diff')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              viewMode === 'diff'
                ? 'bg-white text-gray-900 font-semibold shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Split className="h-3 w-3" />
            Thay Đổi
          </button>
          <button
            type="button"
            onClick={() => setViewMode('raw')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              viewMode === 'raw'
                ? 'bg-white text-gray-900 font-semibold shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Code2 className="h-3 w-3" />
            JSON Gốc
          </button>
        </div>
      </div>

      {viewMode === 'diff' ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs overflow-x-auto space-y-1.5">
          {allKeys.length === 0 ? (
            <p className="text-gray-400 italic">Không có dữ liệu snapshot</p>
          ) : (
            allKeys.map((key) => {
              const beforeVal = before[key];
              const afterVal = after[key];
              const hasBefore = key in before;
              const hasAfter = key in after;
              const isChanged =
                JSON.stringify(beforeVal) !== JSON.stringify(afterVal);

              if (!hasBefore && hasAfter) {
                // Newly added key
                return (
                  <div
                    key={key}
                    className="flex items-start gap-2 bg-emerald-50 text-emerald-900 p-2 rounded border border-emerald-200"
                  >
                    <span className="font-bold select-none text-emerald-600">
                      +
                    </span>
                    <span className="font-semibold text-gray-900">{key}:</span>
                    <span className="break-all">
                      {JSON.stringify(afterVal)}
                    </span>
                  </div>
                );
              }

              if (hasBefore && !hasAfter) {
                // Removed key
                return (
                  <div
                    key={key}
                    className="flex items-start gap-2 bg-rose-50 text-rose-900 p-2 rounded border border-rose-200"
                  >
                    <span className="font-bold select-none text-rose-600">
                      -
                    </span>
                    <span className="font-semibold text-gray-900">{key}:</span>
                    <span className="line-through break-all text-rose-700">
                      {JSON.stringify(beforeVal)}
                    </span>
                  </div>
                );
              }

              if (isChanged) {
                // Modified key
                return (
                  <div
                    key={key}
                    className="space-y-1 rounded border border-gray-200 bg-white p-2.5 shadow-2xs"
                  >
                    <div className="font-semibold text-indigo-700 text-[11px]">
                      {key}
                    </div>
                    <div className="flex items-start gap-2 text-rose-700 text-[11px] bg-rose-50/50 p-1 rounded">
                      <span className="font-bold select-none text-rose-600">
                        -
                      </span>
                      <span className="line-through break-all">
                        {JSON.stringify(beforeVal)}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-700 text-[11px] bg-emerald-50/50 p-1 rounded">
                      <span className="font-bold select-none text-emerald-600">
                        +
                      </span>
                      <span className="break-all">
                        {JSON.stringify(afterVal)}
                      </span>
                    </div>
                  </div>
                );
              }

              // Unchanged key
              return (
                <div
                  key={key}
                  className="flex items-start gap-2 text-gray-500 px-1 py-0.5 text-[11px]"
                >
                  <span className="text-gray-700">{key}:</span>
                  <span className="text-gray-600 break-all">
                    {JSON.stringify(afterVal)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div>
            <div className="text-[11px] font-semibold text-gray-500 mb-1">
              Trước Khi Thay Đổi (Before)
            </div>
            <pre className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-800 overflow-x-auto max-h-80">
              {JSON.stringify(before, null, 2)}
            </pre>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-gray-500 mb-1">
              Sau Khi Thay Đổi (After)
            </div>
            <pre className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-800 overflow-x-auto max-h-80">
              {JSON.stringify(after, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
