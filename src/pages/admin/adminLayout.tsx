import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
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

interface AdminLayoutProps {
  children?: React.ReactNode;
}

/**
 * Administrative Layout matching Figma Node #42:3822
 * - Fixed 260px Aside sidebar
 * - Complete 10 navigation items under OPERATIONS
 * - Version badge v2.4
 * - Production / CDN status
 * - Current Staff profile pill with logout action
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  // 10 navigation links exactly in Figma order from node #42:3822
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
      ready: false,
    },
    {
      name: 'Inventory Management',
      href: '/admin/inventory',
      icon: Boxes,
      ready: false,
    },
    {
      name: 'Orders & Shipments',
      href: '/admin/orders',
      icon: Truck,
      ready: false,
    },
    {
      name: 'Returns & Refunds',
      href: '/admin/returns',
      icon: RotateCcw,
      ready: false,
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: UserCheck,
      ready: false,
    },
    {
      name: 'Marketing & Coupons',
      href: '/admin/marketing',
      icon: Tag,
      ready: false,
    },
    {
      name: 'Staff & Roles',
      href: '/admin/staff',
      icon: Users,
      ready: true, // Implemented in US-39
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit-logs',
      icon: History,
      ready: true, // Implemented in US-42
    },
    {
      name: 'System Settings',
      href: '/admin/settings',
      icon: Settings,
      ready: false,
    },
  ];

  return (
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
              {navItems.map((item) => {
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

                    {item.ready ? (
                      <span
                        className="h-2 w-2 rounded-full shrink-0 bg-emerald-500"
                        title="Feature Available"
                      />
                    ) : (
                      <span className="font-label-sm px-1.5 py-0.5 rounded text-[10px] bg-[#1f2937] text-[#9ca3af] border border-[#374151]">
                        Soon
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-space-md border-t border-[#1f2937] flex flex-col gap-space-sm">
          {/* Environment Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-label-sm text-[#9ca3af]">Production</span>
            </div>
            <span className="font-label-sm text-[#6b7280]">MXP / CDN</span>
          </div>

          {/* Storefront Quick Link */}
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
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-sm text-xs shrink-0">
                AV
              </div>
              <div className="truncate text-left">
                <span className="font-label-sm text-white block truncate">
                  Atelier Global
                </span>
                <span className="font-body-sm text-[#9ca3af] text-[10px] block truncate">
                  Staff Role Active
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('access_token');
                window.location.href = '/auth/login';
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
                <span className="font-label-md text-on-surface leading-tight">
                  Alexander Vance
                </span>
                <span className="font-label-sm text-on-surface-variant leading-tight">
                  Lead Operations
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm">
                AV
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
  );
};
