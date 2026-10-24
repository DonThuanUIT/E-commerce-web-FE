import React from 'react';
import {
  X,
  ShieldAlert,
  Clock,
  Globe,
  Database,
  ShieldCheck,
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-surface-container-lowest border-l border-[#e5e7eb] p-space-lg flex flex-col justify-between shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#edeef0]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container border border-outline-variant text-on-surface">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="font-label-sm tracking-widest text-secondary uppercase">
                  FORENSIC EVIDENCE DOSSIER
                </div>
                <h2 className="font-headline-sm text-on-surface uppercase">
                  Audit Log Event Details
                </h2>
                <p className="font-body-sm text-secondary font-mono">
                  EVENT_UUID: {log.id}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Summary Pill Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-surface-container-low border border-[#e5e7eb]">
              <div className="flex items-center gap-1.5 text-secondary text-[10px] mb-1 font-label-sm">
                <Clock className="h-3 w-3 text-secondary" />
                <span>TIMESTAMP (LOCAL)</span>
              </div>
              <div className="text-on-surface font-semibold font-body-sm">
                {new Date(log.createdAt).toLocaleString('en-US')}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low border border-[#e5e7eb]">
              <div className="flex items-center gap-1.5 text-secondary text-[10px] mb-1 font-label-sm">
                <Globe className="h-3 w-3 text-secondary" />
                <span>ORIGIN IP / LOCATION</span>
              </div>
              <div className="text-on-surface font-semibold truncate font-body-sm">
                {log.ip || 'Internal Network'}
              </div>
            </div>
          </div>

          {/* Entity & Actor Information */}
          <div className="rounded-lg bg-surface-container-low border border-[#e5e7eb] p-4 space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-[#edeef0] pb-2 font-label-sm">
              <span className="text-secondary uppercase">
                Operator Identity
              </span>
              <span className="text-on-surface font-bold">
                {log.actorId ? `Staff #${log.actorId.slice(0, 8)}` : 'SYSTEM'}{' '}
                (Type {log.actorType})
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#edeef0] pb-2 font-label-sm">
              <span className="text-secondary uppercase">Target Entity</span>
              <span className="text-on-surface font-bold">
                {log.entityType} #{log.entityId.slice(0, 8)}
              </span>
            </div>

            <div className="flex items-center justify-between font-label-sm">
              <span className="text-secondary uppercase">Enacted Mutation</span>
              <span className="px-2 py-0.5 rounded-lg font-bold bg-surface-container text-on-surface border border-outline-variant">
                {log.action}
              </span>
            </div>
          </div>

          {/* Snapshot Diff Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-label-sm text-secondary uppercase tracking-wider">
              <Database className="h-4 w-4 text-secondary" />
              <span>State Transition Diff (Payload Comparison)</span>
            </div>

            <AuditLogDiffViewer
              beforeState={log.beforeState}
              afterState={log.afterState}
            />
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-6 border-t border-[#edeef0] flex items-center justify-between font-label-sm">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            <span>Immutable Chain Recorded</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-neutral-800 text-on-primary font-label-md uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
