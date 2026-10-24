import React from 'react';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const RoleMatrixCard: React.FC = () => {
  const matrixData = [
    {
      role: 'EXECUTIVE / ADMIN',
      code: 'ADMIN',
      badgeColor: 'bg-primary text-on-primary',
      description:
        'Full domain administrative control over entire Atelier node',
      percentage: '100%',
      scope: 'Full Domain',
      capabilities: [
        { name: 'Personnel & Role Management', allowed: true },
        { name: 'Disbursement & Refund Approval', allowed: true },
        { name: 'Audit Log & Forensic Access', allowed: true },
        { name: 'System Parameters & PKI Configuration', allowed: true },
      ],
    },
    {
      role: 'OPS & ATELIER SPECIALIST',
      code: 'INVENTORY',
      badgeColor: 'bg-secondary text-on-secondary',
      description:
        'Manage product catalog, inventory variants, and order fulfillment',
      percentage: '42%',
      scope: 'SKU / Storage',
      capabilities: [
        { name: 'Catalog & Product Management', allowed: true },
        { name: 'Stock Levels & Size Charts', allowed: true },
        { name: 'Waybill & Dispatch Creation', allowed: true },
        { name: 'Operator Provisioning or Deactivation', allowed: false },
      ],
    },
    {
      role: 'WAREHOUSE & FULFILLMENT',
      code: 'FULFILLMENT',
      badgeColor: 'bg-inverse-surface text-inverse-on-surface',
      description: 'Oversee packing, field auditing, and carrier handoffs',
      percentage: '35%',
      scope: 'Parcels / Customs',
      capabilities: [
        { name: 'Print Waybills & Packing Slips', allowed: true },
        { name: 'Barcode Scan Inbound / Outbound', allowed: true },
        { name: 'Carrier Status Updates', allowed: true },
        { name: 'Financial & Voucher Access', allowed: false },
      ],
    },
    {
      role: 'CLIENTELE CARE',
      code: 'SUPPORT',
      badgeColor: 'bg-surface-container-highest text-on-surface',
      description: 'Customer inquiries, returns handling, and sizing advisory',
      percentage: '20%',
      scope: 'Read / Tickets',
      capabilities: [
        { name: 'Lookup Customer Profiles & Orders', allowed: true },
        { name: 'View Bespoke Measurement Profiles', allowed: true },
        { name: 'Process Return & Refund Tickets', allowed: true },
        { name: 'Modify System Configuration', allowed: false },
      ],
    },
  ];

  return (
    <div className="mt-space-xl grid grid-cols-1 lg:grid-cols-3 gap-gutter">
      {/* Policy Enactment Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between border border-[#e5e7eb]">
        <div>
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-sm text-secondary uppercase">
              Policy Enactment
            </span>
            <ShieldCheck className="h-5 w-5 text-on-surface" />
          </div>
          <h3 className="font-headline-sm text-on-surface mb-space-xs">
            Role-Based Access Guard
          </h3>
          <p className="font-body-sm text-secondary leading-relaxed">
            Session lifetimes expire after 4 hours of inactivity. API key
            generation requires biometric hardware token confirmation.
          </p>
        </div>

        <div className="mt-space-md p-space-sm bg-surface-container-low rounded-lg border border-[#e5e7eb]">
          <div className="flex items-center justify-between font-label-sm mb-1">
            <span className="text-secondary uppercase">Compliance Status</span>
            <span className="text-on-surface font-semibold">ISO 27001-OK</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-full" />
          </div>
        </div>
      </div>

      {/* Privilege Topology Breakdown */}
      <div className="lg:col-span-2 bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between border border-[#e5e7eb]">
        <div>
          <div className="flex items-center justify-between mb-space-sm">
            <div>
              <span className="font-label-sm text-secondary uppercase">
                Privilege Topology
              </span>
              <h3 className="font-headline-sm text-on-surface mt-0.5">
                Matrix Access Breakdown
              </h3>
            </div>
            <span className="font-label-sm bg-surface-container px-2 py-1 rounded-lg text-secondary">
              UPDATED REAL-TIME
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm my-space-sm">
            {matrixData.map((item) => (
              <div
                key={item.code}
                className="p-space-sm bg-surface-container-low rounded-lg flex flex-col border border-[#e5e7eb]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-secondary">
                    {item.code}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-label-sm uppercase ${item.badgeColor}`}
                  >
                    {item.scope}
                  </span>
                </div>
                <span className="font-headline-sm text-on-surface mt-1">
                  {item.percentage}
                </span>
                <div className="mt-2 space-y-1">
                  {item.capabilities.slice(0, 2).map((cap) => (
                    <div
                      key={cap.name}
                      className="flex items-center gap-1 text-[10px] font-body-sm text-secondary truncate"
                    >
                      {cap.allowed ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                      ) : (
                        <Lock className="h-3 w-3 text-secondary shrink-0" />
                      )}
                      <span className="truncate">{cap.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-space-xs font-label-sm text-secondary border-t border-[#edeef0] mt-space-sm">
          <span>Restricted access to financial write-keys: 1 role</span>
          <span className="text-on-surface font-semibold">
            ENFORCEMENT: STRICT_ZERO_TRUST
          </span>
        </div>
      </div>
    </div>
  );
};
