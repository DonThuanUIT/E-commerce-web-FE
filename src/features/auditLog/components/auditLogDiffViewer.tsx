import React, { useState } from 'react';
import { Code2, Split, Copy, Check } from 'lucide-react';

interface AuditLogDiffViewerProps {
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  reason?: string | null;
}

export const AuditLogDiffViewer: React.FC<AuditLogDiffViewerProps> = ({
  beforeState,
  afterState,
  reason,
}) => {
  const [viewMode, setViewMode] = useState<'diff' | 'raw'>('diff');
  const [copied, setCopied] = useState(false);

  const before = beforeState || {};
  const after = afterState || {};

  const allKeys = Array.from(
    new Set([...Object.keys(before), ...Object.keys(after)]),
  ).sort();

  const handleCopyRaw = () => {
    const rawPayload = JSON.stringify({ beforeState, afterState }, null, 2);
    navigator.clipboard.writeText(rawPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 rounded-lg bg-surface-container-lowest border border-[#e5e7eb] p-space-md text-xs font-body-sm shadow-sm">
      {/* Diff Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edeef0] pb-3">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-secondary uppercase tracking-wider">
            FORENSIC DELTA VIEWER
          </span>
          <span className="text-secondary">•</span>
          <span className="font-label-sm text-secondary">
            {allKeys.length} state fields analyzed
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Raw Payload */}
          <button
            type="button"
            onClick={handleCopyRaw}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high border border-[#e5e7eb] font-label-sm text-on-surface transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy Raw JSON</span>
              </>
            )}
          </button>

          {/* Toggle View Mode */}
          <div className="flex items-center bg-surface-container p-0.5 rounded-lg border border-[#e5e7eb]">
            <button
              type="button"
              onClick={() => setViewMode('diff')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-label-sm transition-colors cursor-pointer ${
                viewMode === 'diff'
                  ? 'bg-primary text-on-primary'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <Split className="h-3 w-3" />
              <span>Delta Compare</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-label-sm transition-colors cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-primary text-on-primary'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <Code2 className="h-3 w-3" />
              <span>Raw JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reason Docket Card if available */}
      {reason && (
        <div className="p-3 rounded-lg bg-surface-container-low border border-[#e5e7eb] text-[11px]">
          <span className="text-secondary uppercase font-label-sm block text-[10px] mb-0.5">
            Docket Authorization Justification:
          </span>
          <span className="text-on-surface font-body-sm">{reason}</span>
        </div>
      )}

      {/* Main Diff Content */}
      {viewMode === 'diff' ? (
        <div className="rounded-lg border border-[#e5e7eb] bg-surface-container-low p-3 font-mono text-xs overflow-x-auto space-y-2">
          {allKeys.length === 0 ? (
            <p className="text-secondary italic text-[11px]">
              No state mutations detected (payload is empty or unchanged)
            </p>
          ) : (
            allKeys.map((key) => {
              const beforeVal = before[key];
              const afterVal = after[key];
              const hasBefore = key in before;
              const hasAfter = key in after;
              const isChanged =
                JSON.stringify(beforeVal) !== JSON.stringify(afterVal);

              if (!hasBefore && hasAfter) {
                // Newly inserted key (+)
                return (
                  <div
                    key={key}
                    className="flex items-start gap-2 bg-emerald-100 border border-emerald-200 text-emerald-900 p-2.5 rounded-lg text-[11px]"
                  >
                    <span className="font-bold select-none text-emerald-700 font-mono">
                      +
                    </span>
                    <span className="font-bold text-emerald-950">{key}:</span>
                    <span className="break-all font-mono">
                      {JSON.stringify(afterVal)}
                    </span>
                  </div>
                );
              }

              if (hasBefore && !hasAfter) {
                // Deleted key (-)
                return (
                  <div
                    key={key}
                    className="flex items-start gap-2 bg-red-100 border border-red-200 text-red-900 p-2.5 rounded-lg text-[11px]"
                  >
                    <span className="font-bold select-none text-red-700 font-mono">
                      -
                    </span>
                    <span className="font-bold text-red-950">{key}:</span>
                    <span className="line-through break-all font-mono text-red-800">
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
                    className="space-y-1.5 rounded-lg border border-[#e5e7eb] bg-surface-container-lowest p-3"
                  >
                    <div className="font-bold text-on-surface font-label-sm">
                      FIELD: {key}
                    </div>
                    {/* Before line (-) */}
                    <div className="flex items-start gap-2 text-red-900 text-[11px] bg-red-100 border border-red-200 p-2 rounded-lg">
                      <span className="font-bold select-none text-red-700">
                        -
                      </span>
                      <span className="line-through break-all">
                        {JSON.stringify(beforeVal)}
                      </span>
                    </div>
                    {/* After line (+) */}
                    <div className="flex items-start gap-2 text-emerald-900 text-[11px] bg-emerald-100 border border-emerald-200 p-2 rounded-lg">
                      <span className="font-bold select-none text-emerald-700">
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
                  className="flex items-start gap-2 text-secondary px-2 py-1 text-[11px]"
                >
                  <span className="text-secondary font-medium">{key}:</span>
                  <span className="text-on-surface break-all font-mono">
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
            <div className="font-label-sm font-bold text-secondary uppercase mb-1">
              Before Mutation (Prior State)
            </div>
            <pre className="rounded-lg border border-[#e5e7eb] bg-surface-container-low p-3 text-on-surface overflow-x-auto max-h-72 text-[11px]">
              {JSON.stringify(before, null, 2)}
            </pre>
          </div>
          <div>
            <div className="font-label-sm font-bold text-secondary uppercase mb-1">
              After Mutation (Post State)
            </div>
            <pre className="rounded-lg border border-[#e5e7eb] bg-surface-container-low p-3 text-on-surface overflow-x-auto max-h-72 text-[11px]">
              {JSON.stringify(after, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
