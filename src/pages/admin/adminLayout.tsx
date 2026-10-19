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
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 antialiased flex flex-col md:flex-row">
      {/* Aside Sidebar: Fixed 260px wide as in Figma EL-ae445f6b */}
      <aside className="w-full md:w-[260px] md:min-h-screen shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between z-20">
        <div>
          {/* Top Brand Header (Figma EL-80625a07) */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-black text-white font-bold text-xs tracking-widest">
                A
              </div>
              <div>
                <span className="font-semibold tracking-wider text-sm text-gray-900 uppercase block leading-tight">
                  ATELIER
                </span>
                <span className="text-[10px] tracking-widest text-gray-600 uppercase block font-mono">
                  OS / ADMIN
                </span>
              </div>
            </div>

            {/* Version Badge (Figma EL-31ac622e) */}
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-gray-100 text-gray-600 border border-gray-200">
              v2.4
            </span>
          </div>

          {/* Section: OPERATIONS (Figma EL-280cfac0) */}
          <div className="px-5 pt-4 pb-2">
            <span className="text-[10px] font-semibold tracking-widest text-gray-600 uppercase font-mono block">
              OPERATIONS
            </span>
          </div>

          {/* Navigation Items (Figma Nav EL-99324298) */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-gray-500'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.ready ? (
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                        isActive ? 'bg-emerald-400' : 'bg-emerald-500'
                      }`}
                      title="Tính năng sẵn sàng"
                    />
                  ) : (
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded tracking-wider ${
                        isActive
                          ? 'bg-neutral-800 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Sắp có
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section (Figma EL-7069b44f) */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* Environment Status (Figma EL-21b44d32 & EL-699500f6) */}
          <div className="flex items-center justify-between px-2 text-[11px] text-gray-600 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-gray-700">Production</span>
            </div>
            <span>MXP / CDN</span>
          </div>

          {/* Storefront Quick Link */}
          <NavLink
            to="/"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Store className="h-3.5 w-3.5 text-gray-500" />
            <span>Về Cửa Hàng (Storefront)</span>
          </NavLink>

          {/* Current Staff Card (Figma EL-3cadfb94) */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 truncate">
              <div className="h-7 w-7 rounded-full bg-black text-white font-bold text-[10px] flex items-center justify-center uppercase shrink-0">
                AG
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  Atelier Global
                </p>
                <p className="text-[10px] text-emerald-800 font-medium">
                  Staff Role Active
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Đăng xuất phiên làm việc')}
              title="Đăng xuất"
              className="p-1 rounded text-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
};
