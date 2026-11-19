import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  RotateCcw,
  UserCheck,
  Tag,
  Users,
  History,
  Settings,
  Store,
  LogOut,
} from 'lucide-react';
import { StaffProtectedRoute } from '../../features/staffAuth/components/staffProtectedRoute.tsx';
import { useStaffAuthStore } from '../../features/staffAuth/stores/useStaffAuthStore.ts';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

/**
 * Administrative Layout matching Figma Node #42:3822
 * - Fixed 260px Aside sidebar
 * - Complete navigation items under OPERATIONS (filtered by RBAC permissions)
 * - Version badge v2.4
 * - Current Staff profile pill with dynamic authenticated user info & logout action
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const staff = useStaffAuthStore((state) => state.staff);
  const logout = useStaffAuthStore((state) => state.logout);
  const permissions = staff?.permissions || [];

  const getInitials = (name?: string) => {
    if (!name) return 'SA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navItems = [
    {
      name: 'Overview',
      href: '/admin/overview',
      icon: LayoutDashboard,
      ready: false,
    },
    {
      name: 'Catalog & Products',
      href: '/admin/products',
      icon: Package,
      permission: 'product:read',
      ready: false,
    },
    {
      name: 'Inventory Management',
      href: '/admin/inventory',
      icon: Boxes,
      permission: 'inventory:read',
      ready: false,
    },
    {
      name: 'Orders & Shipments',
      href: '/admin/orders',
      icon: Truck,
      permission: 'shipment:read',
      ready: false,
    },
    {
      name: 'Returns & Refunds',
      href: '/admin/returns',
      icon: RotateCcw,
      permission: 'return:read',
      ready: false,
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: UserCheck,
      permission: 'customer:read',
      ready: false,
    },
    {
      name: 'Marketing & Coupons',
      href: '/admin/marketing',
      icon: Tag,
      permission: 'marketing:read',
      ready: false,
    },
    {
      name: 'Staff & Roles',
      href: '/admin/staff',
      icon: Users,
      permission: 'staff:read',
      ready: true, // Implemented in US-39
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit-logs',
      icon: History,
      permission: 'audit:read',
      ready: true, // Implemented in US-42
    },
    {
      name: 'System Settings',
      href: '/admin/settings',
      icon: Settings,
      permission: 'settings:read',
      ready: false,
    },
  ];

  const visibleNavItems = navItems.filter(
    (item) => !item.permission || permissions.includes(item.permission),
  );

  return (
    <StaffProtectedRoute>
      <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface antialiased flex flex-col md:flex-row">
        {/* Aside Sidebar: Fixed 260px wide matching Stitch Screen 9 & 10 */}
        <aside className="w-full md:w-[260px] md:min-h-screen shrink-0 bg-[#111827] border-r border-[#1f2937] flex flex-col justify-between z-20">
          <div>
            {/* Top Brand Header */}
            <div className="h-16 flex items-center justify-between px-space-md border-b border-[#1f2937]">
              <div className="flex flex-col">
                <span className="font-headline-sm text-white tracking-tight uppercase leading-none">
                  ATELIER
                </span>
                <span className="font-label-sm text-[#9ca3af] tracking-wider uppercase mt-1">
                  OS / ADMIN
                </span>
              </div>

              {/* Version Badge */}
              <span className="font-label-sm px-2 py-0.5 rounded-lg bg-[#1f2937] text-[#e5e7eb] border border-[#374151]">
                v2.4
              </span>
            </div>

            {/* Section: OPERATIONS */}
            <div className="px-space-md py-space-sm">
              <span className="font-label-sm text-[#6b7280] uppercase tracking-wider block mb-space-xs">
                Operations
              </span>
              {/* Navigation Items */}
              <nav className="flex flex-col gap-1">
                {visibleNavItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={`flex items-center justify-between px-space-sm py-2 rounded-lg transition-all font-body-sm group ${
                        isActive
                          ? 'bg-[#1f2937] text-white font-medium'
                          : 'text-[#9ca3af] hover:bg-[#1f2937] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive
                              ? 'text-white'
                              : 'text-[#9ca3af] group-hover:text-white'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {/* Status indicator: green dot for implemented, 'Planned' badge for placeholder */}
                      {item.ready ? (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"
                          title="Active Module"
                        />
                      ) : (
                        <span className="text-[10px] font-label-sm px-1.5 py-0.5 rounded bg-[#374151] text-[#9ca3af] shrink-0">
                          Planned
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Aside Footer */}
          <div className="p-space-md border-t border-[#1f2937] flex flex-col gap-3">
            {/* Storefront return link */}
            <NavLink
              to="/"
              className="flex items-center gap-2 px-space-sm py-1.5 rounded-lg font-body-sm text-[#9ca3af] hover:text-white hover:bg-[#1f2937] transition-colors"
            >
              <Store className="h-4 w-4 text-[#9ca3af]" />
              <span>Storefront Front-Desk</span>
            </NavLink>

            {/* Current Staff Card */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#1a2234] border border-[#2d3748]">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-headline-sm text-xs shrink-0 font-medium">
                  {getInitials(staff?.fullName)}
                </div>
                <div className="truncate text-left">
                  <span className="font-label-sm text-white block truncate">
                    {staff?.fullName || 'Atelier Global'}
                  </span>
                  <span className="font-body-sm text-[#9ca3af] text-[10px] block truncate">
                    {staff?.role.name || 'Staff Role Active'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/admin/login', { replace: true });
                }}
                title="Sign Out"
                className="p-1 rounded-lg text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col bg-surface-container-low">
          {/* Sticky Top Header Bar matching Stitch Screen 9 & 10 */}
          <header className="sticky top-0 z-40 h-16 bg-[#ffffff] border-b border-[#e5e7eb] px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 w-72 md:w-96">
              <div className="relative w-full flex items-center">
                <input
                  className="w-full h-[38px] pl-3 pr-14 bg-surface-container-lowest border border-[#e5e7eb] rounded-lg font-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                  placeholder="Search operators, audit logs, permissions..."
                  type="text"
                />
                <div className="absolute right-2.5 flex items-center gap-0.5 px-1.5 py-0.5 bg-surface-container border border-outline-variant rounded text-[10px] font-label-sm text-on-surface-variant">
                  <span>⌘</span>
                  <span>K</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-md">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant text-secondary text-[11px] font-label-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>STRICT_PKI ENFORCED</span>
              </div>

              <div className="h-6 w-px bg-outline-variant" />

              <div className="flex items-center gap-space-sm pl-1">
                <div className="flex flex-col text-right">
                  <span className="font-label-md text-on-surface leading-tight font-medium">
                    {staff?.fullName || 'Alexander Vance'}
                  </span>
                  <span className="font-label-sm text-on-surface-variant leading-tight text-xs">
                    {staff?.role.name || 'Lead Operations'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-label-sm font-medium">
                  {getInitials(staff?.fullName)}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 min-w-0 bg-surface-container-low">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </StaffProtectedRoute>
  );
};
