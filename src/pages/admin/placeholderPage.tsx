import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  RotateCcw,
  UserCheck,
  Tag,
  Settings,
  Hammer,
  ShieldCheck,
  History,
} from 'lucide-react';
import { AdminLayout } from './adminLayout';

interface FeatureMeta {
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
}

const FEATURE_METAS: Record<string, FeatureMeta> = {
  '/admin/overview': {
    title: 'Operational Overview',
    category: 'BI & ANALYTICS',
    description:
      'Real-time business intelligence reports, traffic analytics, and operational health metrics.',
    icon: LayoutDashboard,
  },
  '/admin/products': {
    title: 'Catalog & Products',
    category: 'CATALOG MANAGEMENT',
    description:
      'Manage catalog items, fashion variants, sizing specifications, and lookbook assets.',
    icon: Package,
  },
  '/admin/inventory': {
    title: 'Inventory Management',
    category: 'SUPPLY CHAIN',
    description:
      'Monitor multi-warehouse stock levels, low-inventory alerts, and stock transfers.',
    icon: Boxes,
  },
  '/admin/orders': {
    title: 'Orders & Shipments',
    category: 'FULFILLMENT',
    description:
      'Order fulfillment pipeline, invoice generation, parcel tracking, and carrier integrations.',
    icon: Truck,
  },
  '/admin/returns': {
    title: 'Returns & Refunds',
    category: 'CUSTOMER CARE',
    description:
      'Return merchandising authorization (RMA), item inspection, and automated refund workflows.',
    icon: RotateCcw,
  },
  '/admin/customers': {
    title: 'Customers Directory',
    category: 'CRM & CLIENTELE',
    description:
      'Clientele VIP profiles, bespoke tailoring measurements, and purchase histories.',
    icon: UserCheck,
  },
  '/admin/marketing': {
    title: 'Marketing & Coupons',
    category: 'CAMPAIGNS',
    description:
      'Campaign promotion codes, voucher discounts, and seasonal capsule events.',
    icon: Tag,
  },
  '/admin/settings': {
    title: 'System Settings',
    category: 'CORE CONFIG',
    description:
      'Payment gateway integrations, default currencies, email templates, and security policies.',
    icon: Settings,
  },
};

export const PlaceholderAdminPage: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const meta = FEATURE_METAS[currentPath] || {
    title: 'Module Under Construction',
    category: 'UPCOMING FEATURE',
    description:
      'This administrative docket is actively being provisioned and will be deployed in an upcoming milestone.',
    icon: Hammer,
  };

  const Icon = meta.icon;

  return (
    <AdminLayout>
      <div className="p-6 sm:p-12 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container border border-outline-variant text-secondary text-[11px] font-label-sm tracking-widest uppercase mb-6">
          <Hammer className="h-3.5 w-3.5 text-secondary animate-bounce" />
          <span>{meta.category} // IN ACTIVE DEVELOPMENT</span>
        </div>

        {/* Feature Icon */}
        <div className="h-20 w-20 rounded-lg bg-surface-container-lowest border border-[#e5e7eb] shadow-sm flex items-center justify-center text-on-surface mb-6">
          <Icon className="h-10 w-10 text-on-surface" />
        </div>

        {/* Heading */}
        <h1 className="font-headline-lg text-on-surface uppercase tracking-tight mb-3">
          {meta.title}
        </h1>

        <p className="font-body-sm text-secondary max-w-md leading-relaxed mb-8">
          {meta.description}
        </p>

        {/* Notice Card */}
        <div className="rounded-lg border border-[#e5e7eb] bg-surface-container-lowest p-6 shadow-sm max-w-lg w-full text-left space-y-3 mb-8">
          <p className="font-label-sm font-semibold uppercase tracking-wider text-secondary">
            Deployment Roadmap Advisory
          </p>
          <p className="font-body-sm text-on-surface leading-relaxed">
            System priority is currently focused on Core Identity Access
            Management and Immutable Audit Logging. This module will be wired to
            backend endpoints in the subsequent sprint.
          </p>
        </div>

        {/* Quick Links to Available Features */}
        <div className="space-y-2 w-full max-w-sm">
          <p className="font-label-sm text-secondary uppercase tracking-wider font-semibold mb-3">
            Ready for Live Operation:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/admin/staff"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md tracking-wider text-on-primary uppercase hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Staff Directory</span>
            </Link>
            <Link
              to="/admin/audit-logs"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-surface-container-lowest px-4 py-2.5 font-label-md tracking-wider text-on-surface uppercase hover:bg-surface-container transition-colors shadow-2xs"
            >
              <History className="h-4 w-4" />
              <span>Audit Logs</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
