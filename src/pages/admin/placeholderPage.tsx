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
    title: 'Overview & Tổng Quan',
    category: 'BI & ANALYTICS',
    description:
      'Báo cáo doanh thu, lưu lượng truy cập và chỉ số vận hành tổng thể theo thời gian thực.',
    icon: LayoutDashboard,
  },
  '/admin/products': {
    title: 'Catalog & Products',
    category: 'CATALOG MANAGEMENT',
    description:
      'Quản lý danh mục sản phẩm, biến thể thời trang, bảng kích cỡ và hình ảnh bộ sưu tập.',
    icon: Package,
  },
  '/admin/inventory': {
    title: 'Inventory Management',
    category: 'SUPPLY CHAIN',
    description:
      'Kiểm soát tồn kho theo từng kho hàng, cảnh báo tồn thấp và điều chuyển sản phẩm.',
    icon: Boxes,
  },
  '/admin/orders': {
    title: 'Orders & Shipments',
    category: 'FULFILLMENT',
    description:
      'Xử lý đơn đặt hàng, xuất hoá đơn, theo dõi vận chuyển và tích hợp đối tác giao hàng.',
    icon: Truck,
  },
  '/admin/returns': {
    title: 'Returns & Refunds',
    category: 'CUSTOMER CARE',
    description:
      'Quy trình xử lý đổi trả hàng, thẩm định sản phẩm và hoàn tiền tự động.',
    icon: RotateCcw,
  },
  '/admin/customers': {
    title: 'Customers Directory',
    category: 'CRM & CLIENTELE',
    description:
      'Hồ sơ khách hàng thân thiết, số đo may đo bespoke và lịch sử mua sắm atelier.',
    icon: UserCheck,
  },
  '/admin/marketing': {
    title: 'Marketing & Coupons',
    category: 'CAMPAIGNS',
    description:
      'Tạo mã ưu đãi, voucher giảm giá, chiến dịch capsule khuyến mãi theo mùa.',
    icon: Tag,
  },
  '/admin/settings': {
    title: 'System Settings',
    category: 'CORE CONFIG',
    description:
      'Cấu hình cổng thanh toán, đơn vị tiền tệ, mẫu email và chính sách bảo mật hệ thống.',
    icon: Settings,
  },
};

export const PlaceholderAdminPage: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const meta = FEATURE_METAS[currentPath] || {
    title: 'Tính Năng Đang Phát Triển',
    category: 'UPCOMING FEATURE',
    description:
      'Tính năng này đang được đội ngũ hoàn thiện và sẽ ra mắt trong giai đoạn tiếp theo.',
    icon: Hammer,
  };

  const Icon = meta.icon;

  return (
    <AdminLayout>
      <div className="p-6 sm:p-12 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono tracking-widest uppercase mb-6">
          <Hammer className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
          <span>{meta.category} // ĐANG PHÁT TRIỂN</span>
        </div>

        {/* Feature Icon */}
        <div className="h-20 w-20 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-900 mb-6">
          <Icon className="h-10 w-10 text-gray-800" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 uppercase tracking-tight mb-3">
          {meta.title}
        </h1>

        <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-8">
          {meta.description}
        </p>

        {/* Notice Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs max-w-lg w-full text-left space-y-3 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Thông Báo Lộ Trình Triển Khai
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">
            Hệ thống đang ưu tiên các phân hệ cốt lõi về bảo mật tài khoản và
            kiểm toán dữ liệu. Các tính năng này sẽ được tích hợp với Backend
            trong Sprint tiếp theo.
          </p>
        </div>

        {/* Quick Links to Available Features */}
        <div className="space-y-2 w-full max-w-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
            Trải Nghiệm Các Chức Năng Đã Sẵn Sàng:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/admin/staff"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold tracking-wider text-white uppercase hover:bg-neutral-800 transition-colors shadow-2xs"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Quản Lý Nhân Sự</span>
            </Link>
            <Link
              to="/admin/audit-logs"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold tracking-wider text-gray-800 uppercase hover:bg-gray-50 transition-colors shadow-2xs"
            >
              <History className="h-4 w-4" />
              <span>Nhật Ký Kiểm Toán</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
